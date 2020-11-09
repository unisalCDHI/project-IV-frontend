import { PostService } from './../../services/post.service';
import { MatDialog } from '@angular/material/dialog';
import { Post } from './../../shared/models/post';
import { User } from './../../shared/models/user';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ConfirmDialogComponent } from 'src/app/shared/components/dialog-confirmation/confirm-dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../home/posts/posts.component.scss']
})
export class ProfileComponent implements OnInit {

  userId: number;
  user: User;
  posts: Post[];
  postSelected: Post;

  constructor(private userService: UserService, private dialog: MatDialog, private postService: PostService) { 
    this.userId = Number(localStorage.getItem('id'));
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
}
