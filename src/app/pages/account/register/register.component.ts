import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerUserForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private _snackBar: MatSnackBar, private router: Router) { 
    if (localStorage.getItem('token')) {
      this.router.navigate(['']);
    }
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.registerUserForm = this.formBuilder.group({
      name: [null],
      username: [null],
      email: [null],
      password: [null]
    });
  }

  onSubmit() {
    this.userService.save(this.registerUserForm.value).subscribe(res => {
      this._snackBar.open(this.registerUserForm.value.email + " registrado com sucesso, confirme seu e-mail.", "Fechar", {
        duration: 5000
      });
    }, error => {
      console.log(error)
      this._snackBar.open(error.error.errors.length > 0 ? error.error.errors[0].defaultMessage : "Erro desconhecido", "Fechar", {
        duration: 2000
      });
    })
  }
}
