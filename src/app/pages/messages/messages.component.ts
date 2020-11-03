import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from './../../services/message.service';
import { UserService } from './../../services/user.service';
import { Message } from './../../shared/models/message';
import { User } from './../../shared/models/user';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

  @ViewChild('messageDiv') private messageDiv: ElementRef;

  searchForm: FormGroup;
  messageForm: FormGroup;

  users: User[] = [];
  currentUser: User = null;
  messages: Message[] = [];
  currentRequest: any;
  scrollIt: boolean = false;

  messagesLength: number = 0;

  constructor(private userService: UserService, private messageService: MessageService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
    this.searchName();
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      name: ['']
    });

    this.messageForm = this.formBuilder.group({
      body: [''],
      image: [''],
      recipientId: [null]
    });
  }

  searchName(): void {
    this.userService.findAllSearch(this.searchForm.value.name).subscribe(res => {
      this.users = res;
    })
  }

  changeToUser(user) {
    this.scrollIt = true;
    this.currentUser = user;
    clearInterval(this.currentRequest);
    this.findAll(user.id);
    this.pooling(user.id);
  }

  pooling(userId) {
    this.currentRequest = setInterval(() => {
      this.scrollIt = false;
      this.findAll(userId);
    }, 1000);
  }

  findAll(userId) {
    this.messageService.findAll(userId).subscribe(res => {
      this.messages = res;
    });
  }

  scrollDown() {
      this.messageDiv.nativeElement.scrollTop = this.messageDiv.nativeElement.scrollHeight;

    // this.messagesLength = this.messages.length;
  }

  ngOnDestroy() {
    clearInterval(this.currentRequest);
  }

  sendMessage() {
    this.messageForm.value.recipientId = this.currentUser.id;
    this.messageService.send(this.messageForm.value).subscribe(res => {
      this.scrollIt = true;
      this.messageForm.reset();
      this.findAll(this.currentUser.id);
    }, error => {
      // todo
    });
  }
}
