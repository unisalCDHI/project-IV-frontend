import { FormBuilder, FormGroup } from '@angular/forms';
import { PostService } from './../../../services/post.service';
import { Subscription } from 'rxjs';
import { Post } from './../../../shared/models/post';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ConfirmDialogComponent } from 'src/app/shared/components/dialog-confirmation/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss', '../posts/posts.component.scss']
})
export class CommentsComponent implements OnInit, OnDestroy {

  @Input() commentary: Post;

  @Output() closed = new EventEmitter();

  subs: Subscription[] = [];
  comments: Post[] = [];
  poolingRequest: any;
  commentForm: FormGroup;
  imgBase64: string = '';
  showEmojiPicker = false;
  myId: number;

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

  ngOnInit(): void {
    this.buildForm();
    this.findOne();
    this.findAllCommentaries();
    this.pooling();
  }

  buildForm() {
    this.commentForm = this.fb.group({
      body: [''],
      image: ['']
    });
  }

  comment() {
    this.commentForm.value.image = this.imgBase64;
    this.imgBase64 = '';
    this.subs.push(
      this.postService.comment(this.commentary.id, this.commentForm.value).subscribe(res => {
        this.findOne();
        this.findAllCommentaries();
         this.commentForm.reset();
      })
    );
  }

  clearImage() {
    this.imgBase64 = '';
    this.commentForm.value.image = '';
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.imgBase64 = myReader.result.toString();
      if (this.commentForm.value.body === null)
        this.commentForm.value.body = '';
    }
    myReader.readAsDataURL(file);
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event) {
    this.commentForm.get('body').patchValue(this.commentForm.value.body + event.emoji.native);
    // this.showEmojiPicker = false;
  }

  onFocus() {
    this.showEmojiPicker = false;
  }
  onBlur() {
    this.showEmojiPicker = false;
  }

  like(post: Post) {
    this.subs.push(
      this.postService.update(post.id, null).subscribe(res => {
        this.findOne();
        this.findAllCommentaries();
      })
    );
  }

  close(): void {
    this.closed.emit();
  }

  pooling() {
    this.poolingRequest = setInterval(() => {
      this.findOne();
      this.findAllCommentaries();
    }, 6000);
  }


  findOne() {
    this.subs.push(
      this.postService.findOne(this.commentary.id).subscribe(res => {
        this.commentary = res;
      })
    );
  }

  findAllCommentaries() {
    this.subs.push(
      this.postService.findAll(`${this.commentary.id}/commentaries`).subscribe(res => {
        this.comments = res;
      })
    );
  }

  deleteComment(commentary: Post) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirme a ação',
        message: 'Você tem certeza que deseja remover este comentário?'
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.postService.delete(commentary.id).subscribe(res => {
          this.findAllCommentaries();
          this.findOne();
        }, error => { console.log(error) });
      }
    });

  }

  formatDate(date) {
    return new Date(date).toLocaleString();
  }

  ngOnDestroy(): void {
    clearInterval(this.poolingRequest);
    this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }

}
