import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {StudentProfile} from '../models/student-profile';

@Injectable({
  providedIn: 'root'
})
export class StudentProfileService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiBaseUrl}/api/student/profile`;

  getMyProfile(): Observable<StudentProfile> {
    return this.http.get<StudentProfile>(this.apiUrl);
  }

  createProfile(
    profile: StudentProfile
  ): Observable<StudentProfile> {
    return this.http.post<StudentProfile>(
      this.apiUrl,
      profile
    );
  }

  updateProfile(
    profile: StudentProfile
  ): Observable<StudentProfile> {
    return this.http.put<StudentProfile>(
      this.apiUrl,
      profile
    );
  }

  uploadDocument(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<void>(
      `${this.apiUrl}/document`,
      formData
    );
  }

  getDocument(): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/document`,
      { responseType: 'blob' }
    );
  }
}
