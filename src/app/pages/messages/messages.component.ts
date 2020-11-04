import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/dialog-confirmation/confirm-dialog.component';
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
  messagesBefore: Message[] = [null]
  messagesDeletedBefore = -1;

  loading: boolean = false;

  currentRequest: any;
  scrollIt: boolean = false;

  messagesLength: number = 0;

  imgBase64: string = '';

  constructor(private userService: UserService, private messageService: MessageService, private formBuilder: FormBuilder, private dialog: MatDialog) { }

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
    this.loading=true;
    this.scrollIt = true;
    this.currentUser = user;
    this.messageForm.reset();
    this.messagesBefore = [null]
    this.messagesDeletedBefore = -1;
    clearInterval(this.currentRequest);
    this.findAll(user.id);
    this.pooling(user.id);
  }

  clearImage() {
    this.imgBase64 = '';
    this.messageForm.value.image = '';
  }

  pooling(userId) {
    this.currentRequest = setInterval(() => {
      this.scrollIt = false;
      this.findAll(userId, true);
    }, 5000);
  }

  findAll(userId, pooled = false) {
    this.messageService.findAll(userId).subscribe(res => {
      let deletedMsgs = 0
      if (pooled)
        res.forEach(msg => msg.deleted ? deletedMsgs += 1 : null);

      if (pooled ? (!(res.length == this.messagesBefore.length) || deletedMsgs != this.messagesDeletedBefore) : true) {
        this.messagesDeletedBefore = deletedMsgs;
        this.messagesBefore = this.messages;
        this.messages = res;
      }
      if (!pooled){
        this.scrollIt = true;
        this.loading = false;
      }
    });
  }

  scrollDown() {
    this.messageDiv.nativeElement.scrollTop = this.messageDiv.nativeElement.scrollHeight;
  }

  deleteMessage(message) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirme a ação',
        message: 'Você tem certeza que deseja remover esta mensagem?'
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.messageService.remove(this.currentUser.id, message.id).subscribe(res => {
          this.findAll(this.currentUser.id);
        }, error => { console.log(error) });
      }
    });

  }

  ngOnDestroy() {
    clearInterval(this.currentRequest);
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.imgBase64 = myReader.result.toString();
      if (this.messageForm.value.body === null)
        this.messageForm.value.body = '';
    }
    myReader.readAsDataURL(file);
  }

  sendMessage() {
    this.loading = true;
    this.messageForm.value.recipientId = this.currentUser.id;
    this.messageForm.value.image = this.imgBase64;
    this.imgBase64 = '';
    this.messageService.send(this.messageForm.value).subscribe(res => {
      this.messageForm.reset();
      this.findAll(this.currentUser.id);
    }, error => {
      // todo
    });
  }
}
