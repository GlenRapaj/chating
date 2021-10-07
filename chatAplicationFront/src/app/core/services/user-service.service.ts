import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { LoginDto } from '../models/loginDto.interface';
import { ProfileSearchParameters } from '../models/profileSearchParameters.interface';
import { UserRegistrationData } from '../models/userRegistrationData.interface';


// const url : string = 'http://localhost:8080/user/';
const url : string = 'https://chating-back-end.herokuapp.com/user/';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor( private http : HttpClient ) { }

  createNewUser( userRegistrationData : UserRegistrationData ) : Observable< any >{
    let headers = new HttpHeaders();
    headers.set('content-type', 'application/json' );

    let option = {
      'headers' : headers
    }; 
    return this.http.post<any>( `${url}create-user`,  userRegistrationData, option );
  }

  logInUser( loginDto : LoginDto ) : Observable<any>{ 
    //  { responseType : 'text' } 
    return this.http.post<any>( `${url}login`, loginDto, );
  }

  getUserProfile( id : string )  : Observable<any> {
    return this.http.get<any>( `${url}user-profile/${id}` );
  }

  search( profileSearch : ProfileSearchParameters, page : number, size : number ) : Observable<any> { 
    //  { responseType : 'text' } 
    return this.http.post<any>( `${url}search-profile?page=${page}&size=${size}`, profileSearch );
  }

  getUserData( id : string ) : Observable<any> {
    return this.http.get<any>( `${url}get-user-details/${id}` );
  }

  logOut( id : string  ) : Observable<any> {
    return this.http.get<any>( `${url}log-out/${id}` );
  }

  checkUserStatus( id : string ) : Observable<any> {
    return this.http.get<any>( `${url}check-user-status/${id}` );
  }

  getChatRoomUsers( id : string ) : Observable<any> {
    return this.http.get<any>( `${url}get-chat-room-users/${id}` );
  }

  modifyPassword( id : string, password : string ) : Observable<any>  {
    return this.http.put<any>( `${url}modify-password/${id}`, password );
  }

  modifyLastName( id : string, lastName : string ) : Observable<any>{
    return this.http.put<any>( `${url}modify-last-name/${id}`, lastName );
  }

  modifyName( id : string, name : string ): Observable<any>{
    return this.http.put<any>( `${url}modify-name/${id}`, name );
  }

  modifyEmail( id : string, email : string ): Observable<any>{
    return this.http.put<any>( `${url}modify-email/${id}`, email );
  }

  modifyUserName( id : string, userName : string ): Observable<any>{
    console.log( 'userName : ', userName);
    
    return this.http.put<any>( `${url}modify-user-name/${id}`, userName );
  }

  modifyAbout( id : string, about : string ): Observable<any>{
    return this.http.put<any>( `${url}modify-about/${id}`, about );
  }

  removeLanguage( id : string, language : string ): Observable<any> {
    return this.http.put<any>( `${url}remove-language/${id}`, language );
  }

  removeInterest( id : string, interest : string ): Observable<any> {
    return this.http.put<any>( `${url}remove-interest/${id}`, interest );
  }

  setInterest( id : string, interest : string ) : Observable<any> {
    return this.http.put<any>( `${url}set-interest/${id}`, interest );
  }

  setCity( id : string, city : string ) : Observable<any> {
    return this.http.put<any>( `${url}set-city/${id}`, city );
  }

  setLanguage( id : string, language : string )  : Observable<any> {
    return this.http.put<any>( `${url}set-language/${id}`, language );
  }

}
