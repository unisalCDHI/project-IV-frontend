import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
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
  currentUserId: number;
  user: User;
  subs: Subscription[] = [];
  posts: Post[];
  postSelected: Post;
  seePosts: boolean = false;
  imgBase64: string = '';
  readyToSave: boolean = false;
  loadingName: boolean = false;

  constructor(private userService: UserService, private dialog: MatDialog, private postService: PostService, private _snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(routeParams => {
      this.userId = Number(localStorage.getItem('id'));
      this.currentUserId = Number(this.route.snapshot.params['id']);
      this.getProfileData();
    });
  }

  getProfileData() {
    this.userService.findOne(Number(this.currentUserId)).subscribe(res => {
      this.readyToSave = false;
      this.user = res;
      this.getPostData();
    }, error => {
      console.log(error);
      this.router.navigate(['/404']);
    })
  }

  getPostData() {
    this.userService.getPosts(Number(this.currentUserId)).subscribe(res => {
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

  saveName(event) {
    this.loadingName = true;
    this.user.name = event.target.value;
    this.subs.push(
      this.userService.update(this.user.id, this.user).subscribe(res => {
        this.getPostData();
        this.loadingName = false;
      }, error => {
        this.loadingName = false;
      })
    );
    console.log()
  }

  follow() {
    this.subs.push(
      this.userService.follow(this.user.id).subscribe(res => {
        this.getProfileData();
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
