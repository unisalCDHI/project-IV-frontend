import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from './../../shared/models/user';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  users: User[] = [];
  searchForm: FormGroup;

  constructor(private userService: UserService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildSearchForm();
  }

  buildSearchForm() {
    this.searchForm = this.formBuilder.group({
      name: [null]
    });
  }

  searchName(): void {
    this.userService.findAllSearch(this.searchForm.value.name).subscribe(res => {
      this.users = res;
    })
  }

}
