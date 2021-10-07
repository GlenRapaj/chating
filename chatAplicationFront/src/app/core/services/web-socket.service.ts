import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
//import * as SockJS from 'sockjs-client';
//import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor() { }

    // Open connection with the back-end socket
    public connect() {
      // const url : string = 'https://chating-back-end.herokuapp.com/user/';
      // http://localhost:8080/socket
      let socket = new SockJS(`https://chating-back-end.herokuapp.com/socket`);
  
      let stompClient = Stomp.over(socket);
  
      return stompClient;
    }
}
