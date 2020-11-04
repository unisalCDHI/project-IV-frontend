import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User } from './../../shared/models/user';
import { UserService } from './../../services/user.service';
import { Post } from './../../shared/models/post';
import { PostService } from './../../services/post.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  selectedFile: File = null;
  subs: Subscription[] = [];
  posts: Post[] = [];
  postForm: FormGroup;
  poolingRequest: any;
  file: any;

  constructor(private postService: PostService, private _sanitizer: DomSanitizer, private fb: FormBuilder) { }

  buildForm() {
    this.postForm = this.fb.group({
      body: [null],
      image: [null]
    });
  }

  ngOnInit(): void {
    this.findAll();
    this.pooling();
    this.buildForm();
  }

  pooling() {
    this.poolingRequest = setInterval(() => {
      this.findAll();
    }, 5000);
  }

  findAll() {
    console.log(this.file);
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
    clearInterval(this.poolingRequest);
    this.subs.forEach(sub => {
      sub.unsubscribe();
    })
  }

  // onFileSelected(event) {
  //   this.selectedFile = <File>event.target.files[0];
  // }

  post() {
    this.subs.push(
      this.postService.save(this.postForm.value).subscribe(res => {
        this.findAll();
      })
    );
  }





}
