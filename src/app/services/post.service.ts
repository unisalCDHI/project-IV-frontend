import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Post } from './../shared/models/post';
import { CrudService } from './crud.service';

@Injectable({
    providedIn: 'root'
  })
  export class PostService extends CrudService<Post, number> {
  
    constructor(protected _http: HttpClient) {
        super(_http, environment.apiUrl + '/posts')
    }

    comment(postId: number, commentary: Post): Observable<any> {
      return this._http.post<any>(`${this._base}/${postId}`, commentary);
    }
}
  