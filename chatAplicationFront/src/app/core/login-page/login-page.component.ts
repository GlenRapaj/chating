import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginDto } from '../models/loginDto.interface';
import { LoginDataService } from '../services/login-data.service';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  form !: FormGroup;
  matcher : any = new ErrorStateMatcher();
  inputType : string = 'password';
  
  constructor( private userService : UserServiceService, private router: Router, 
    private _snackBar : MatSnackBar, private logiData : LoginDataService ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null),
      phone: new FormControl(null),
      password: new FormControl(null, [Validators.required]),
      checkbox : new FormControl(false)
    });
  }

  submitForm(){
    //console.log('submitForm');
    const loginData : LoginDto = {
      password: this.form.get('password')?.value,
      email: this.form.get('email')?.value,
      tel: null
    };
    
    this.userService.logInUser(loginData)
    .subscribe( userId =>{

      this.logiData.setId( userId.message );
      this.logiData.setLogedIn( true );
      this.router.navigate(['/comunication', userId.message]);

    }, error => {
      
      this._snackBar.open(error.error.localizedMessage, '', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: 'error-modalbox'
      });

      const formFields = {
        email: null,
        phone: null,
        password: null,
        checkbox : false
      };
      this.form.setValue( formFields );
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
