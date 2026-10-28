
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OnDestroy } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { StudentProfile } from '../../models/student-profile';
import { StudentProfileService } from '../../services/student-profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {

  private readonly sanitizer = inject(DomSanitizer);

  documentExists = false;
  documentName: string | null = null;
  documentPreviewUrl: SafeResourceUrl | null = null;

  private documentObjectUrl: string | null = null;

  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(StudentProfileService);

  readonly maxFileSize = 2 * 1024 * 1024;

  loading = true;
  saving = false;
  uploading = false;
  profileExists = false;

  successMessage = '';
  errorMessage = '';
  documentMessage = '';

  selectedFile: File | null = null;

  readonly diplomaTypes = [
    { value: 'BTS', label: 'BTS' },
    { value: 'DUT', label: 'DUT' },
    { value: 'DEUG', label: 'DEUG' },
    { value: 'DUST', label: 'DUST' },
    { value: 'OFPPT', label: 'OFPPT' },
    { value: 'OTHER', label: 'Other diploma' }
  ] as const;

  readonly profileForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.maxLength(150)
    ]],
    phone: ['', Validators.maxLength(30)],
    dateOfBirth: [''],
    address: ['', Validators.maxLength(300)],

    diplomaType: ['', Validators.required],
    diplomaName: ['', Validators.maxLength(150)],
    institution: ['', Validators.maxLength(200)],

    graduationYear: this.fb.control<number | null>(null, [
      Validators.min(1950),
      Validators.max(2100)
    ]),
    firstYearGrade: this.fb.control<number | null>(null, [
      Validators.min(0),
      Validators.max(20)
    ]),
    secondYearGrade: this.fb.control<number | null>(null, [
      Validators.min(0),
      Validators.max(20)
    ])
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';


    this.profileService.getMyProfile().subscribe({
      next: (profile) => {
        this.profileExists = true;
        this.documentExists = !!profile.documentName;
        this.documentName = profile.documentName ?? null;
        this.profileForm.patchValue({
          ...profile,
          dateOfBirth: profile.dateOfBirth ?? '',
          graduationYear: profile.graduationYear ?? null,
          firstYearGrade: profile.firstYearGrade ?? null,
          secondYearGrade: profile.secondYearGrade ?? null

        });

        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.profileExists = false;
        } else {
          this.errorMessage = 'Unable to load your profile.';
        }

        this.loading = false;
      }
    });
  }

  saveProfile(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving = true;

    const value = this.profileForm.getRawValue();

    const profile: StudentProfile = {
      firstName: value.firstName!.trim(),
      lastName: value.lastName!.trim(),
      email: value.email!.trim(),
      phone: value.phone?.trim() ?? '',
      dateOfBirth: value.dateOfBirth || null,
      address: value.address?.trim() ?? '',
      diplomaType: value.diplomaType as StudentProfile['diplomaType'],
      diplomaName: value.diplomaName?.trim() ?? '',
      institution: value.institution?.trim() ?? '',
      graduationYear: value.graduationYear,
      firstYearGrade: value.firstYearGrade,
      secondYearGrade: value.secondYearGrade
    };

    const request = this.profileExists
      ? this.profileService.updateProfile(profile)
      : this.profileService.createProfile(profile);

    request.subscribe({
      next: () => {
        this.profileExists = true;
        this.successMessage = 'Profile saved successfully.';
        this.saving = false;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.errorMessage =
            'A profile already exists. Reload the page and try again.';
        } else if (error.status === 400) {
          this.errorMessage =
            'Some information is invalid. Please check the form.';
        } else if (error.status === 401 || error.status === 403) {
          this.errorMessage =
            'Your session is not authorized. Please log in again.';
        } else {
          this.errorMessage = 'Unable to save your profile.';
        }

        this.saving = false;
      }
    });
  }

  onDocumentSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedFile = null;
    this.documentMessage = '';

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      this.documentMessage = 'Only PDF files are allowed.';
      input.value = '';
      return;
    }

    if (file.size > this.maxFileSize) {
      this.documentMessage = 'The PDF must not exceed 2 MB.';
      input.value = '';
      return;
    }

    if (file.size === 0) {
      this.documentMessage = 'The selected file is empty.';
      input.value = '';
      return;
    }

    this.selectedFile = file;
    this.documentMessage = 'PDF selected successfully.';
  }

  uploadDocument(): void {
    this.documentMessage = '';

    if (!this.profileExists) {
      this.documentMessage =
        'Save your student profile before uploading a document.';
      return;
    }

    if (!this.selectedFile) {
      this.documentMessage = 'Please select a PDF file first.';
      return;
    }

    this.uploading = true;

    this.profileService.uploadDocument(this.selectedFile).subscribe({
      next: () => {
        this.documentMessage = 'Document uploaded successfully.';
        this.selectedFile = null;
        this.uploading = false;

        this.documentExists = true;
        this.documentName = this.selectedFile ?? null;
        this.documentMessage = 'Document uploaded successfully.';

        this.previewDocument();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.documentMessage =
            'The PDF is invalid or exceeds the 2 MB limit.';
        } else if (error.status === 404) {
          this.documentMessage =
            'Please save your student profile before uploading.';
        } else if (error.status === 401 || error.status === 403) {
          this.documentMessage =
            'Your session is not authorized. Please log in again.';
        } else {
          this.documentMessage =
            'Document upload failed. Please try again.';
        }

        this.uploading = false;
      }
    });
  }

  previewDocument(): void {
    this.profileService.getDocument().subscribe({
      next: (blob: Blob) => {
        this.clearDocumentPreview();

        this.documentObjectUrl = URL.createObjectURL(
          new Blob([blob], { type: 'application/pdf' })
        );

        this.documentPreviewUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(
            this.documentObjectUrl
          );
      },
      error: (error) => {
        this.errorMessage =
          error.status === 404
            ? 'No document has been uploaded yet.'
            : 'Unable to preview the document.';
      }
    });
  }

  private clearDocumentPreview(): void {
    if (this.documentObjectUrl) {
      URL.revokeObjectURL(this.documentObjectUrl);
      this.documentObjectUrl = null;
    }

    this.documentPreviewUrl = null;
  }

  ngOnDestroy(): void {
    this.clearDocumentPreview();
  }
}
