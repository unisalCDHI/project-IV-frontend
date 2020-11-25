import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/components/dialog-confirmation/confirm-dialog.component';
import { PostService } from './../../../services/post.service';
import { Post } from './../../../shared/models/post';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnDestroy {
  selectedFile: File = null;
  subs: Subscription[] = [];
  posts: Post[] = [];
  postForm: FormGroup;
  poolingRequest: any;
  myId: number;

  postSelected: Post;

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

  constructor(private postService: PostService, private fb: FormBuilder, private dialog: MatDialog) {
    this.myId = Number(localStorage.getItem('id'));
   }

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
        this.postForm.reset();
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

  openCommentarySection(post): void {
    this.postSelected = post;
  }

  closeCommentarySection(): void {
    this.postSelected = undefined;
  }

  deletePost(post: Post) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirme a ação',
        message: 'Você tem certeza que deseja remover esta postagem?'
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.postService.delete(post.id).subscribe(res => {
          this.findAll();
        }, error => { console.log(error) });
      }
    });

  }

  formatDate(date) {
    return new Date(date).toLocaleString();
  }

  ngOnDestroy() {
    clearInterval(this.poolingRequest);
    this.subs.forEach(sub => {
      sub.unsubscribe();
    })
  }

}
