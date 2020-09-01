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

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      email: [null],
      password: [null]
    });
  }

  onSubmit() {
    this.loginService.save(this.loginForm.value).subscribe(res => {

    }, error => {
      this._snackBar.open(error.error.message, "Fechar", {
        duration: 2000,
      });
    })
  }
}
