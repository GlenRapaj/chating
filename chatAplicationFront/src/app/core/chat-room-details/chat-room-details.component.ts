import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatingService } from '../services/chating.service';

@Component({
  selector: 'app-chat-room-details',
  templateUrl: './chat-room-details.component.html',
  styleUrls: ['./chat-room-details.component.scss']
})
export class ChatRoomDetailsComponent implements OnInit {

  about : string = '';
  chatType : string = '';
  joinCode : string = '';
  name : string = '';
  topic : string = '';
  languages : string = '';

  constructor( private chatingService: ChatingService, @Inject(MAT_DIALOG_DATA) public data: { name: string } ) { }

  ngOnInit(): void {
    console.log( this.data.name );
    this.chatingService.getChatRoomDetails( this.data.name ).subscribe( chatRoomDetails =>{
      console.log( chatRoomDetails );
      this.about = chatRoomDetails.about;
      this.chatType = chatRoomDetails.chatType;
      this.name = chatRoomDetails.name;
      this.topic = chatRoomDetails.topic;
     
      if( chatRoomDetails.joinCode != null ){
        this.joinCode = chatRoomDetails.joinCode;
      }

      if( chatRoomDetails.languages.length != 0 ){
        this.languages = chatRoomDetails.languages[0];
      }
    });
  }

}
