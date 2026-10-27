import {Component, inject, OnInit} from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import {StudentProfile} from '../../models/student-profile';
import {HttpErrorResponse} from '@angular/common/http';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {StudentProfileService} from '../../services/student-profile.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(StudentProfileService);

  loading = true;
  saving = false;
  profileExists = false;
  successMessage = '';
  errorMessage = '';

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

        this.profileForm.patchValue({
          ...profile,
          graduationYear: profile.graduationYear ?? null,
          firstYearGrade: profile.firstYearGrade ?? null,
          secondYearGrade: profile.secondYearGrade ?? null,
          dateOfBirth: profile.dateOfBirth ?? ''
        });

        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.profileExists = false;
        } else {
          this.errorMessage =
            'Unable to load your profile. Please try again.';
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
        this.successMessage = 'Your profile has been saved successfully.';
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
          this.errorMessage =
            'Unable to save your profile. Please try again.';
        }

        this.saving = false;
      }
    });
  }
}
