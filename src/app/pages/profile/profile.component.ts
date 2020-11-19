import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/components/dialog-confirmation/confirm-dialog.component';
import { PostService } from './../../services/post.service';
import { UserService } from './../../services/user.service';
import { Post } from './../../shared/models/post';
import { User } from './../../shared/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../home/posts/posts.component.scss'],
})
export class ProfileComponent implements OnInit {

  userId: number;
  user: User;
  subs: Subscription[] = [];
  posts: Post[];
  postSelected: Post;
  seePosts: boolean = false;
  imgBase64: string = '';
  readyToSave: boolean = false;

  constructor(private userService: UserService, private dialog: MatDialog, private postService: PostService, private _snackBar: MatSnackBar, private route: ActivatedRoute) {
    this.userId = Number(this.route.snapshot.params['id']);
  }

  ngOnInit(): void {
    this.getProfileData();
  }

  getProfileData() {
    this.userService.findOne(Number(this.userId)).subscribe(res => {
      this.readyToSave = false;
      this.user = res;
      this.getPostData();
    })
  }

  getPostData() {
    this.userService.getPosts(Number(this.userId)).subscribe(res => {
      this.posts = res;
    })
  }

  closeCommentarySection(): void {
    this.postSelected = undefined;
  }

  like(post: Post) {
    this.subs.push(
      this.postService.update(post.id, null).subscribe(res => {
        this.getPostData();
      })
    );
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
          this.getPostData();
        }, error => { console.log(error) });
      }
    });

  }

  formatDate(date) {
    return new Date(date).toLocaleString();
  }

  openCommentarySection(post): void {
    this.postSelected = post;
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.imgBase64 = myReader.result.toString();
      this.user.avatar = this.imgBase64;
      this.readyToSave = true;
    }
    myReader.readAsDataURL(file);
  }

  showPosts() {
    this.seePosts = true;
  }

  showUser() {
    this.seePosts = false;
  }

  save() {
    const config = new MatSnackBarConfig();
    config.duration = 5000;

    this.userService.update(this.user.id, this.user).subscribe(res => {
      config.panelClass = ['background-green'];
      const message = 'Usuário salvo com sucesso'
      this._snackBar.open(message, null, config);
      this.getProfileData();
    }, error => {
      config.panelClass = ['background-red'];
      const message = error.message.toString();
      this._snackBar.open(message, null, config);
    });
  }
}
