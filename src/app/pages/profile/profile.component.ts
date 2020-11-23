import { Post } from './../../shared/models/post';
import { User } from './../../shared/models/user';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../home/posts/posts.component.scss']
})
export class ProfileComponent implements OnInit {

  userId: string;
  user: User;
  posts: Post[];

  constructor(private userService: UserService) { 
    this.userId = localStorage.getItem('id');
  }

  ngOnInit(): void {
    this.getProfileData();
  }

  getProfileData() {
    this.userService.findOne(Number(this.userId)).subscribe(res => {
      this.user = res;
      this.getPostData();
    })
  }

  getPostData() {
    this.userService.getPosts(Number(this.userId)).subscribe(res => {
      this.posts = res;      
    })
  }
}
