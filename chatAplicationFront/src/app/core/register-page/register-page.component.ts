import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserRegistrationData } from '../models/userRegistrationData.interface';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  form !: FormGroup;
  matcher : any = new ErrorStateMatcher();
  inputType : string = 'password';
  
  constructor( private userService : UserServiceService, private router: Router, private _snackBar : MatSnackBar ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null),
      phone: new FormControl(null),
      password: new FormControl(null, [Validators.required]),
      firstName : new FormControl(null, [Validators.required]),
      lastName : new FormControl(null, [Validators.required]),
      userName : new FormControl(null, [Validators.required]),
      checkbox : new FormControl(false)
    });
  }

  submitForm(){
    //console.log('register submit : ', this.form.getRawValue() );
    const user : UserRegistrationData = {
      name: this.form.get('firstName')?.value,
      lastName: this.form.get('lastName')?.value,
      email: this.form.get('email')?.value,
      tel: null,
      password : this.form.get('password')?.value,
      userName : this.form.get('userName')?.value,
    };

    this.userService.createNewUser(user)
    .subscribe(res => {
      this.router.navigate(['/login'])
    }, error => {
      //console.log(error.error);
      this._snackBar.open(error.error.localizedMessage, '', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: 'error-modalbox'
      });

      const registerFields = {
        email: null,
        phone: null,
        password: null,
        firstName : null,
        lastName : null,
        userName : null,
        checkbox : false
      };

      this.form.setValue( registerFields );
    });
    
  }

  toglePassword(){
    if( this.form.get('checkbox')?.value ){
      this.inputType = 'password';  
    }else{
      this.inputType = 'text';
    }
  }

}
