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

  imgBase64: string = '';

  showEmojiPicker = false;
  sets = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger'
  ]
  set = 'twitter';

  constructor(private postService: PostService, private _sanitizer: DomSanitizer, private fb: FormBuilder) { }

  buildForm() {
    this.postForm = this.fb.group({
      body: [''],
      image: ['']
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

  post() {
    this.postForm.value.image = this.imgBase64;
    this.imgBase64 = '';
    this.subs.push(
      this.postService.save(this.postForm.value).subscribe(res => {
        this.findAll();
      })
    );
  }

  clearImage() {
    this.imgBase64 = '';
    this.postForm.value.image = '';
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.imgBase64 = myReader.result.toString();
      if (this.postForm.value.body === null)
        this.postForm.value.body = '';
    }
    myReader.readAsDataURL(file);
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event) {
    this.postForm.get('body').patchValue(this.postForm.value.body + event.emoji.native);
    // this.showEmojiPicker = false;
  }

  onFocus() {
    this.showEmojiPicker = false;
  }
  onBlur() {
    this.showEmojiPicker = false;
  }

  ngOnDestroy() {
    clearInterval(this.poolingRequest);
    this.subs.forEach(sub => {
      sub.unsubscribe();
    })
  }

}
