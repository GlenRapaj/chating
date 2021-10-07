import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDataService } from '../services/login-data.service';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  isLogedIn : boolean = false;
  id : string = '';

  constructor( private logiData: LoginDataService, private router: Router, private userService: UserServiceService, ) { }


  ngOnInit(): void {

    this.isLogedIn = this.logiData.getLogedIn();
    if (this.isLogedIn) {
      this.id = this.logiData.getId();
    }
  }

  logOut() {
    this.logiData.setId('0');
    this.logiData.setLogedIn(false);
    this.userService.logOut( this.id )
    .subscribe( res=>{
      this.router.navigate(['/login']);
    });
  }

}
