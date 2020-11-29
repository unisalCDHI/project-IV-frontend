import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { CrudService } from './crud.service';
import { Team } from '../shared/models/team';

@Injectable({
    providedIn: 'root'
  })
  export class TeamService extends CrudService<Team, number> {
  
    constructor(protected _http: HttpClient) {
        super(_http, environment.apiUrl + '/teams')
    }
}
  