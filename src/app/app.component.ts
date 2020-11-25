import { UserService } from './services/user.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './shared/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'project-iv-frontend';
  token: string;
  id: string;
  users: User[];

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.changeToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    this.changeToken();
    this.router.navigate(['login']);
  }

  changeToken() {
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('id');
  }

  searchUser(name) {
    this.userService.findAllSearch(name).subscribe(res => {
      this.users = res;
    })
  }
}
