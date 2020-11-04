import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'project-iv-frontend';
  token: string;
  id: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.changeToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    this.changeToken();
    this.router.navigate(['login'])
  }

  changeToken() {
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('id');
  }
}
