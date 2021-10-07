import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainPageComponent } from './core/main-page/main-page.component';
import { LoginPageComponent } from './core/login-page/login-page.component';
import { RegisterPageComponent } from './core/register-page/register-page.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { ChattingPageComponent } from './core/chatting-page/chatting-page.component';
import  {  NgxEmojiPickerModule  }  from  'ngx-emoji-picker';

// Angular Material
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ErrorPageComponent } from './core/error-page/error-page.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import { SearchComponent } from './core/search/search.component';
import { ProfileComponent } from './core/profile/profile.component';
import { GroupComponent } from './core/group/group.component';
import { MessagesComponent } from './core/messages/messages.component';
import { PageComponent } from './core/page/page.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { AvatarModule } from 'ngx-avatar';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ChangeFieldComponent } from './core/change-field/change-field.component';
import { PageUpdateComponent } from './core/page-update/page-update.component';
import { GroupUpdateComponent } from './core/group-update/group-update.component';
import { ChatRoomDetailsComponent } from './core/chat-room-details/chat-room-details.component';
import { ConfirmDeleteComponent } from './core/confirm-delete/confirm-delete.component';
import { CallComponent } from './core/call/call.component';
import { SearchUsersComponent } from './core/search-users/search-users.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ChattingPageComponent,
    ErrorPageComponent,
    SearchComponent,
    ProfileComponent,
    GroupComponent,
    MessagesComponent,
    PageComponent,
    ChangeFieldComponent,
    PageUpdateComponent,
    GroupUpdateComponent,
    ChatRoomDetailsComponent,
    ConfirmDeleteComponent,
    CallComponent,
    SearchUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
    AvatarModule,
    NgxEmojiPickerModule.forRoot(),

    // Angular material
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatListModule,
    MatDialogModule,
    MatTabsModule,
    MatSelectModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatBadgeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
