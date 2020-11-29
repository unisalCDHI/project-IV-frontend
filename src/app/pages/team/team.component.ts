import { TeamService } from './../../services/team.service';
import { Team } from './../../shared/models/team';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss', '../home/posts/posts.component.scss']
})
export class TeamComponent implements OnInit {

  teams: Team[] = [];
  team: Team = new Team();

  constructor(private teamService: TeamService) { }

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

}
