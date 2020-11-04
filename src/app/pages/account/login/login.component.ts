import { AppComponent } from '../../../app.component';
import { LoginService } from '../../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private _snackBar: MatSnackBar, private loginService: LoginService, private router: Router, private appComponent: AppComponent) {
    if (localStorage.getItem('token') || localStorage.getItem('id')) {
      this.router.navigate(['']);
    }
  }

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
    this.loginService.login(this.loginForm.value).pipe(first())
      .subscribe(res => {
        localStorage.setItem('token', res.headers.get('Authorization'));
        localStorage.setItem('id', res.headers.get('Id'));
        this.appComponent.changeToken();
        this.router.navigate(['']);
      }, error => {
        this._snackBar.open(error.error ? error.error.message : 'Erro desconhecido.', "Fechar", {
          duration: 2000,
        });
      })
  }
}
