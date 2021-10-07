import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';


// const url : string = 'http://localhost:8080/';
const url : string = 'https://chating-back-end.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor( private http : HttpClient ) { }

  getCities()  : Observable<any> {
    return this.http.get<any>( `${url}get-cities` );
  } 

  getLanguages()  : Observable<any> {
    return this.http.get<any>( `${url}get-languages` );
  } 

  getInterests()  : Observable<any> {
    return this.http.get<any>( `${url}get-interests` );
  } 

}
