import {Component, inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get('http://localhost:8080/api/hello',
      {responseType: 'text'})
      .subscribe({
        next: (response) => {
          console.log('API response:', response);
        },
        error: (error) => {
          console.error('API error:', error);
        }
      });
  }
}
