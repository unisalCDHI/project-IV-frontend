import { TeamService } from './../../services/team.service';
import { Team } from './../../shared/models/team';
import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/shared/models/post';
import { PostService } from 'src/app/services/post.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/dialog-confirmation/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss', '../home/posts/posts.component.scss']
})
export class TeamComponent implements OnInit {

  teams: Team[] = [];
  team: Team = new Team();
  myId: number;
  postSelected: Post;

  constructor(private teamService: TeamService, private postService: PostService, private dialog: MatDialog) { 
    this.myId = Number(localStorage.getItem('id'));
  }

  ngOnInit(): void {
    this.getTeamData();
  }

  getTeamData() {
      this.teamService.findAll().subscribe(res => {
        this.teams = res;
        // for tests
        this.setTeamFirstForExample(0);
      })
  }

  setTeamFirstForExample(index: number) {
    this.team = ((this.teams.length > 0 && this.teams[index] !== undefined) ? this.teams[index] : new Team());
  }

  like(post: Post) {
      this.postService.update(post.id, null).subscribe(res => {
        this.getTeamData();
      })
  }

  formatDate(date) {
    return new Date(date).toLocaleString();
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
          this.getTeamData();
        }, error => { console.log(error) });
      }
    });
  }

  closeCommentarySection(): void {
    this.postSelected = undefined;
  }

  openCommentarySection(post): void {
    this.postSelected = post;
  }
}
