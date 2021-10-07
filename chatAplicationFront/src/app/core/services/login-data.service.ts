import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginDataService {

  id : string = '0';
  isLogedIn : boolean = false;

  setId( id : string ){
    this.id = id;
  }

  setLogedIn( isLogedIn : boolean ){
    this.isLogedIn = isLogedIn;
  }

  getLogedIn() : boolean {
    return this.isLogedIn ;
  }

  getId(){
    return this.id;
  }

  constructor() { }
}
