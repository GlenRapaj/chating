import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ChatRoomDto } from '../models/chatRoomDto.interface';
import { GroupSearchField } from '../models/groupSearchField.interface';
import { Messages } from '../models/messages.interface';

// const url : string = 'http://localhost:8080/chat/';
const url : string = 'https://chating-back-end.herokuapp.com/chat/';

@Injectable({
  providedIn: 'root'
})
export class ChatingService {

  constructor( private http : HttpClient ) { }

  conectUsers( chatRoomId : string, userId : string )  : Observable<any> {
    return this.http.post<any>( `${url}create-join-chat/${userId}`, chatRoomId );
  } 

  getChatRoomMessages( chatRoomId : string )  : Observable<any> {
    return this.http.get<any>( `${url}get-chat-room-messages/${chatRoomId}` );
  }

  sendMessage( id : string, message : Messages )  : Observable<any> {
    return this.http.post<any>( `${url}send-message/${id}`, message );
  } 

  makeMessageAsSeen( id : string, messageId : string )  : Observable<any> {
    return this.http.get<any>( `${url}seen-message/${id}/${messageId}` );
  }

  deleteMessage( id : string, userId : string ): Observable<any> {
    return this.http.delete<any>( `${url}delete-message/${id}/${userId}` );
  }

  getChatRoomsOfUserProfile( id : string ) : Observable<any> {
    return this.http.get<any>( `${url}chat-rooms/${id}` );
  }

  deleteChatRoom( id : string ): Observable<any> {
    return this.http.delete<any>( `${url}delete-chat-room/${id}` );
  }

  createGroup( id : string, groupType : string, chatRoomData : ChatRoomDto ) : Observable<any> {
    return this.http.post<any>( `${url}create-group/${id}/${groupType}`, chatRoomData );
  }

  searchGroups( profileSearchFields: GroupSearchField, page : number, size : number ) : Observable<any>  {
    return this.http.post<any>( `${url}search-groups?page=${page}&size=${size}`, profileSearchFields );
  }

  getChatGroups( id : string, chatType : string ) : Observable<any> {
    return this.http.get<any>( `${url}get-chat-rooms/${id}/${chatType}` );  // public private
  }

  leaveChat( id : string, userId : string ) : Observable<any> {
    return this.http.get<any>( `${url}leave-chat-room/${id}/${userId}` ); 
  }

  updateChatRoomPage( chatRoomId : string, chatRoomData : ChatRoomDto, id : string ) : Observable<any>{
    return this.http.put<any>( `${url}update-chat-room-page/${chatRoomId}/${id}`, chatRoomData );
  }

  getChatRoomDetails( id : string ) : Observable<any> {
    return this.http.get<any>( `${url}chat-room-details/${id}` ); 
  }

  leaveDeletePrivateConversation( chatRoomId : string, userId : string ) : Observable<any>{
    return this.http.delete<any>( `${url}leave-delete-private-conversation/${chatRoomId}/${userId}` );
  }

  softDeleteMessage( userId : string, messageId : string ){
    return this.http.delete<any>( `${url}soft-delete-message/${messageId}/${userId}` );
  }

}
