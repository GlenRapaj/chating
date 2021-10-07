import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeFieldComponent } from '../change-field/change-field.component';
import { ChatingService } from '../services/chating.service';
import { LoginDataService } from '../services/login-data.service';
import { UserDataService } from '../services/user-data.service';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  id: string = '';
  isLogedIn: boolean = false;
  userName: string = '';
  skreanName: string = '';
  profilePhoto: string = '';
  userProfile !: any;

  cities !: any[];
  languages !: any[];
  interests !: any[];

  interestForm !: FormGroup;
  languageform !: FormGroup;
  cityForm !: FormGroup;

  constructor( public fb: FormBuilder, private userData: UserDataService, private route: ActivatedRoute, private logiData: LoginDataService, private router: Router,
    private userService: UserServiceService,
    private chatingService: ChatingService, private _snackBar: MatSnackBar, public dialog: MatDialog) { }


  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id') as string;

    if (this.id != '0') {
      this.userService.checkUserStatus(this.id).subscribe(userStatus => {
        this.logiData.setLogedIn(userStatus);
        this.logiData.setId(this.id);
        this.isLogedIn = userStatus;
      });
    }

    this.getUserData();

    this.interestForm = this.fb.group({
      interes: new FormControl(null)
    });

    this.languageform = this.fb.group({
      language: new FormControl(null)
    });

    this.cityForm = this.fb.group({
      city: new FormControl(null)
    });

    this.userData.getCities().subscribe(cities => {
      this.cities = cities;
    });

    this.userData.getInterests().subscribe(interests => {
      this.interests = interests;
    });

    this.userData.getLanguages().subscribe(languages => {
      this.languages = languages;
    });
  }

  logOut() {
    this.logiData.setId('0');
    this.logiData.setLogedIn(false);
    this.userService.logOut(this.id)
      .subscribe(res => {
        this.router.navigate(['/login']);
      });
  }

  changePassword(password: string) {
    // console.log(password);

    const dialogRef = this.dialog.open(ChangeFieldComponent, {
      data: { name: password },
      panelClass: 'search-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('Dialog result: ', result.value );
      this.userService.modifyPassword(this.id, result.value).subscribe(res => {
        this.getUserData();

        this._snackBar.open('Changed', '', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'info'
        });
      });
    });
  }

  changeLastName(lastName: string) {
    // console.log(lastName);
    const dialogRef = this.dialog.open(ChangeFieldComponent, {
      data: { name: lastName },
      panelClass: 'search-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('Dialog result: ', result.value );
      this.userService.modifyLastName(this.id, result.value).subscribe(res => {
        this.getUserData();

        this._snackBar.open('Changed', '', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'info'
        });
      });
    });
  }

  changeName(name: string) {
    // console.log(name);
    const dialogRef = this.dialog.open(ChangeFieldComponent, {
      data: { name: name },
      panelClass: 'search-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('Dialog result: ', result.value );
      this.userService.modifyName(this.id, result.value).subscribe(res => {
        this.getUserData();

        this._snackBar.open('Changed', '', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'info'
        });
      });
    });
  }

  changeEmail(email: string) {
    // console.log(email);

    const dialogRef = this.dialog.open(ChangeFieldComponent, {
      data: { name: email },
      panelClass: 'search-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('Dialog result: ', result.value );
      this.userService.modifyEmail(this.id, result.value).subscribe(res => {
        this.getUserData();

        this._snackBar.open('Changed', '', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'info'
        });
      })
    });
  }

  changeUserName(userName: string) {
    // console.log(userName);

    const dialogRef = this.dialog.open(ChangeFieldComponent, {
      data: { name: userName },
      panelClass: 'search-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('Dialog result: ', result.value );
      this.userService.modifyUserName(this.id, result.value).subscribe(res => {
        this.getUserData();

        this._snackBar.open('Changed', '', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'info'
        });
      });
    });
  }

  changeAbout(about: string) {
    // console.log(about);

    const dialogRef = this.dialog.open(ChangeFieldComponent, {
      data: { name: about },
      panelClass: 'search-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('Dialog result: ', result.value);
      this.userService.modifyAbout(this.id, result.value).subscribe(res => {
        this.getUserData();

        this._snackBar.open('Changed', '', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'info'
        });
      });
    });
  }

  removeLanguage( language : string ){
    this.userService.removeLanguage( this.id, language ).subscribe( res =>{
      this.getUserData();

      this._snackBar.open('Removed', '', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: 'info'
      }); 
    });
  }

  removeInterest( interest : string ){
    this.userService.removeInterest( this.id, interest ).subscribe( res =>{
      this.getUserData();

      this._snackBar.open('Removed', '', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: 'info'
      }); 
    });
  }
 
  submitLanguageform(){
     // ska mbaruar
    // console.log( this.languageform.getRawValue() );
    this.userService.setLanguage( this.id, this.languageform.get('language')?.value ).subscribe( res =>{
      this.getUserData();
      this.languageform.get('language')?.setValue(null);

      this._snackBar.open('Added', '', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: 'info'
      });
    });
  }

  submitCityForm(){
     // ska mbaruar
    // console.log( this.cityForm.getRawValue() );
    this.userService.setCity( this.id, this.cityForm.get('city')?.value ).subscribe( res =>{
      this.getUserData();
      this.cityForm.get('city')?.setValue(null);

      this._snackBar.open('Added', '', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: 'info'
      });
    });
  }

  submitInterestForm(){
     // ska mbaruar
    // console.log( this.interestForm.get('interes')?.value );
    this.userService.setInterest( this.id , this.interestForm.get('interes')?.value ).subscribe( res =>{
      this.getUserData();
      this.interestForm.get('interes')?.setValue(null);

      this._snackBar.open('Added', '', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: 'info'
      });
    });
  }

  getUserData(){
    // this.isLogedIn = this.logiData.getLogedIn();
    // if (this.isLogedIn) {
      this.userService.getUserProfile(this.id)
        .subscribe(userProfile => {
          // console.log('res : ', userProfile);
          this.userName = userProfile.name + ' ' + userProfile.lastName;
          this.skreanName = userProfile.userName;
          this.profilePhoto = userProfile.profilePhoto;

          this.userProfile = userProfile;
        });
    // }
  }

}
