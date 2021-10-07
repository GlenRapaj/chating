import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallComponent } from './core/call/call.component';
import { ChattingPageComponent } from './core/chatting-page/chatting-page.component';
import { ErrorPageComponent } from './core/error-page/error-page.component';
import { LoginPageComponent } from './core/login-page/login-page.component';
import { MainPageComponent } from './core/main-page/main-page.component';
import { ProfileComponent } from './core/profile/profile.component';
import { RegisterPageComponent } from './core/register-page/register-page.component';

const routes: Routes = [
  { path: "", component : MainPageComponent, pathMatch : 'full' },
  {path : 'login', component: LoginPageComponent },
  {path : 'register', component: RegisterPageComponent },
  {path : 'comunication/:id', component : ChattingPageComponent },
  {path : 'profile/:id', component : ProfileComponent },
  // {path : 'call/:id', component : CallComponent },
  {path : '**', component : ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
