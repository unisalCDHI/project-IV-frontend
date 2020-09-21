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

  constructor(private postService: PostService, private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.findAll();
    this.pooling();
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

  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    })
  }
}
