import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { PostsComponent } from './pages/home/posts/posts.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './pages/account/register/register.component';
import { LoginComponent } from './pages/account/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationComponent } from './pages/notification/notification.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TeamComponent } from './pages/team/team.component';

const APP_ROUTE: Routes = [
  { path: '', component: PostsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'notifications', component: NotificationComponent, canActivate: [AuthGuard] },
  { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'team', component: TeamComponent, canActivate: [AuthGuard] },
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
]

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTE)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
