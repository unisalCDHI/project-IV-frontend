import { LoginService } from './../services/login.service';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userForm: FormGroup;


  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.userForm = this.formBuilder.group({
      email: [null],
      password: [null]
    });
  }

  onSubmit() {
    this.loginService.save(this.userForm.value).subscribe(res => {

    }, error => {
      console.log(error)
      this._snackBar.open(error.error.message, "Close", {
        duration: 2000,
      });
    })
  }
}
