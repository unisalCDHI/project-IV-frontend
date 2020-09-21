import { User } from './../../shared/models/user';
import { UserService } from './../../services/user.service';
import { Post } from './../../shared/models/post';
import { PostService } from './../../services/post.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  subs: Subscription[] = [];
  posts: Post[] = [];
  currentUser: User;

  constructor(private postService: PostService, private userService: UserService, private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.findAll();
    this.pooling();
    this.getCurrentUser();
  }

  pooling() {
    setInterval(() => {
      this.findAll();
    }, 5000);
  }

  findAll() {
    this.subs.push(
      this.postService.findAll().subscribe(res => {
        this.posts = res;
      })
    );
  }

  like(post: Post) {
    this.subs.push(
      this.postService.update(post.id, null).subscribe(res => {
        this.findAll();
      })
    );
  }

  isLiked(post: Post) {
    post.likes.forEach(user => {
      if (this.currentUser.username === user.username)
        return true;
    });
    return false;
  }

  getCurrentUser() {
    this.subs.push(
      this.userService.findOne(Number(localStorage.getItem('id'))).subscribe(user => {
        this.currentUser = user;
      }) 
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    })
  }
}
