import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './pages/account/register/register.component';
import { LoginComponent } from './pages/account/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const APP_ROUTE: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTE)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
