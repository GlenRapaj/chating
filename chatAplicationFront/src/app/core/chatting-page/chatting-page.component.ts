import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatRoomDetailsComponent } from '../chat-room-details/chat-room-details.component';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { GroupComponent } from '../group/group.component';
import { ChatRoomDto } from '../models/chatRoomDto.interface';
import { ChatRoomTableData } from '../models/chatRoomTableData.interface';
import { Messages } from '../models/messages.interface';
import { PrivateMessages } from '../models/privateMessages.interface';
import { UserDataFront } from '../models/userDataFront.interface';
import { PageUpdateComponent } from '../page-update/page-update.component';
import { PageComponent } from '../page/page.component';
import { SearchUsersComponent } from '../search-users/search-users.component';
import { SearchComponent } from '../search/search.component';
import { ChatingService } from '../services/chating.service';
import { LoginDataService } from '../services/login-data.service';
import { UserServiceService } from '../services/user-service.service';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-chatting-page',
  templateUrl: './chatting-page.component.html',
  styleUrls: ['./chatting-page.component.scss']
})
export class ChattingPageComponent implements OnInit {
  isLogedIn: boolean = false;
  userName: string = '';
  id : string = '0';
  filtertext !: FormGroup;
  sendtext !: FormGroup;
  chatRoomid: string = '';
  stompClient: any;
  messages: Messages[] = [];
  skreanName: string = '';
  profilePhoto: string = '';
  chatDetails !: any;
  cotalker: string = '';

  contacList: PrivateMessages[] = [];

  groupCategories: string[] = ['private group', 'public group'];

  displayedColumns: string[] = ['name', 'topic', 'delete', 'modyfie', 'info'];
  groupDataSourceShow: boolean = false;

  isAdmin: boolean = false;
  showGroupParticipants: boolean = false;
  showContactInfo: boolean = false;

  privateConversationIdList : string[] = [];
  pageIdList : string[] = [];

  participantDetails !: MatTableDataSource<any>;
  participantDetailsdisplayedColumns: string[] = ['photo', 'userName'];
  showChatRoomDataTable: boolean = false;


  @ViewChild(MatPaginator)
  paginator1 !: MatPaginator;

  chatGroups: any[] = [];
  form !: FormGroup;

  // e shtuar
  toggled: boolean = false;
  emojiText: string = '';

  constructor(public fb: FormBuilder, private route: ActivatedRoute, private logiData: LoginDataService, private router: Router,
    private userService: UserServiceService, public dialog: MatDialog,
    private chatingService: ChatingService, private _snackBar: MatSnackBar, private webSocket: WebSocketService) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      filterField: new FormControl(null),
    });

    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.isLogedIn = this.logiData.getLogedIn();

    if (this.id != '0') {
      this.userService.checkUserStatus(this.id).subscribe(userStatus => {
        this.logiData.setLogedIn(userStatus);
        this.logiData.setId(this.id);
        this.isLogedIn = userStatus;
        this.ListMessages();
      });
    }

    this.userService.getUserProfile(this.id).subscribe(userProfile => {
      // console.log('res : ', userProfile);
      this.userName = userProfile.name + ' ' + userProfile.lastName;
      this.skreanName = userProfile.userName;
      this.profilePhoto = userProfile.profilePhoto;
    })

    this.filtertext = new FormGroup({
      filter: new FormControl(null)
    });

    this.sendtext = new FormGroup({
      message: new FormControl(null)
    });

    this.stompClient = this.webSocket.connect();
    this.webSocketgetData();
  }

  logOut() {
    this.logiData.setId('0');
    this.logiData.setLogedIn(false);
    this.userService.logOut(this.id).subscribe(res => {
      this.router.navigate(['/login']);
    });
  }

  search() {
    const dialogRef = this.dialog.open(SearchComponent, {
      data: { name: this.id },
      panelClass: 'search-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Chat Room ID = ${result}`);
      this.chatRoomid = result;

      this.messages.length = 0;
      this.getChatRoomData(this.chatRoomid)
      
      if (this.id != '0') {
        this.chatingService.conectUsers(result, this.id).subscribe(chatRoomId => {
          // console.log(`chatRoomId : ${chatRoomId.message}`);
          this.chatRoomid = chatRoomId.message;

          this._snackBar.open('Connected', '', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: 'info'
          });
        },
          error => {
            console.log(error.error);
            this._snackBar.open(error.error.localizedMessage, '', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: 'error-modalbox'
            })
          });
      }
    });
  }

  privateConversationMessages(chatRoomId: string) {
    this.chatingService.getChatRoomMessages(chatRoomId).subscribe(chatRoomMessages => {
      this.chatRoomid = chatRoomId;
      this.messages.length = 0;
      let userId = '';

      // console.log( 'chatRoomMessages : ', chatRoomMessages);
      for (let chatRoomMessage of chatRoomMessages) {
        const message: Messages = {
          id: chatRoomMessage.id,
          userId: chatRoomMessage.userId,
          messageText: chatRoomMessage.messageText,
          chatRoomId: chatRoomMessage.chatRoomId,
          messageTime: chatRoomMessage.messageTime,
          seenMessage: chatRoomMessage.seenMessage,
          userName: chatRoomMessage.userName,
          profilePhoto: chatRoomMessage.profilePhoto
        };
        userId = chatRoomMessage.userId;

        if (!chatRoomMessage.deletedParticipantId.includes(this.id)) {
          this.messages.push(message);
        }
      }
      // console.log( chatRoomMessages );
      // Do te marrim te dhenat personale per ate userId qe nuk eshte e marresit
      this.getPersonalDetailsOfUser(userId);
    });
  }

  filterMesages() {
    this.messages = this.messages.filter(message => {
      return message.messageText.toLowerCase().includes(this.filtertext.get('filter')?.value.toLowerCase()) || message.messageText.toLowerCase() == this.filtertext.get('filter')?.value.toLowerCase();
    });
  }

  sendMesage() {
    const message: Messages = {
      id: undefined,
      userId: this.id,
      messageText: this.sendtext.get('message')?.value + this.emojiText,
      chatRoomId: this.chatRoomid,
      messageTime: null,
      seenMessage: [],
      userName: this.skreanName,
      profilePhoto: this.profilePhoto
    }
    this.chatingService.sendMessage(this.id, message).subscribe(res => {
      this.privateConversationMessages(this.chatRoomid);
      this.sendtext.get('message')?.setValue('');
    });

    this.emojiText = '';
  }


  webSocketgetData() {
    // Error mesages of stomp
    this.stompClient.connect(
      {}, (frame: any) => {

        //  this.id + this.chatRoomid 
        this.stompClient.subscribe('/topic/notification', (notifications: any) => {

          let incomingMsg = JSON.parse(notifications.body);
          console.log('incomingMsg : ', incomingMsg);

          if (incomingMsg.chatRoomId == this.chatRoomid) {

            if (incomingMsg.deleted == true) {
              this.messages = this.messages.filter(message => {
                return message.id != incomingMsg.id;
              });

            } else {
              const message: Messages = {
                id: incomingMsg.id,
                userId: incomingMsg.userId,
                messageText: incomingMsg.messageText,
                chatRoomId: incomingMsg.chatRoomId,
                messageTime: incomingMsg.messageTime,
                seenMessage: [],
                userName: incomingMsg.userName,
                profilePhoto: incomingMsg.profilePhoto
              }
              this.chatRoomid = incomingMsg.chatRoomId;
              this.messages.push(message);

              // Do bejme nje request per ta bere mesazhin te pare ( seen )
              this.chatingService.makeMessageAsSeen(this.id, incomingMsg.id).subscribe();

              // Do te marrim te dhenat personale per ate userId qe nuk eshte e marresit
              this.getPersonalDetailsOfUser(incomingMsg.userId);

            }
          }
        });
      });
  }

  getPersonalDetailsOfUser(userId: string) {
    // Do te marrim te dhenat personale per ate userId qe nuk eshte e marresit
    this.userService.getUserData(userId).subscribe(userData => {
      this.chatDetails = userData;
    });
  }

  getCurrentTime() {
    let dateTime = new Date();
    return dateTime;
  }

  deleteMessage(message: any) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.chatingService.deleteMessage(message.id, this.id).subscribe(res => {
          this.privateConversationMessages(this.chatRoomid);
        });
      }
    });
  }

  getContactList() {
    this.contacList = [];
    this.privateConversationIdList = [];
    this.chatingService.getChatRoomsOfUserProfile(this.id).subscribe(chatRooms => {
      // console.log('chatRooms : ', chatRooms);

      for (let chatRoom of chatRooms) {
        this.privateConversationIdList.push( chatRoom.id );
        
        for (let id of chatRoom.participants) {
          if (id != this.id) {
            this.userService.getUserProfile(id).subscribe(userProfile => {

              const message: PrivateMessages = {
                id: chatRoom.id,
                topic: chatRoom.topic,
                chatType: '',
                userName: userProfile.userName,
                adminId: '',
              };
              this.contacList.push(message);
              // console.log('this.contacList : ', this.contacList );
            }, error => {
              console.log(error.error);
            });
          }
        }
      }
    });
  }

  getContactChat(contact: any) {
    // console.log( contact );
    this.cotalker = contact.userName;
    this.chatRoomid = contact.id;
    this.privateConversationMessages(contact.id);
  }

  ListMessages() {
    this.showGroupParticipants = false;
    this.showContactInfo = true;
    this.groupDataSourceShow = false;
    this.showChatRoomDataTable = false;
    this.getContactList();
  }

  deleteContactChat(contactId: string) {
    // console.log( 'deleteContactChat : ', contactId );
    this.chatingService.leaveDeletePrivateConversation(contactId, this.id).subscribe();
  }

  createPrivateGroup() {
    const dialogRef = this.dialog.open(GroupComponent, {
      data: { name: this.id },
      panelClass: 'search-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: `, result);

      const chatRoomData: ChatRoomDto = {
        name: result.name,
        topic: result.topic,
        adminId: this.id,
        chatType: 'group',
        about: result.about,
        languages: result.language,
        participants: [],
        joinCode: result.joinCode
      };
      // console.log(' chatRoomData : ', chatRoomData);

      this.chatingService.createGroup(this.id, 'private', chatRoomData).subscribe(res => {
        this._snackBar.open('Changed', '', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'info'
        });
      },
        error => {
          console.log(error.error);
          this._snackBar.open(error.error.localizedMessage, '', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: 'error-modalbox'
          })
        });
    });
  }

  createPublicGroup() {
    const dialogRef = this.dialog.open(PageComponent, {
      data: { name: this.id },
      panelClass: 'search-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: `, result);

      const chatRoomData: ChatRoomDto = {
        name: result.name,
        topic: result.topic,
        adminId: this.id,
        chatType: 'page',
        about: result.about,
        languages: result.language,
        participants: []
      };
      this.chatingService.createGroup(this.id, 'public', chatRoomData)
        .subscribe(res => {
          console.log('res : ', res);
          this.chatRoomid = res.id;
          this.cotalker = res.name;

          this._snackBar.open('Changed', '', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: 'info'
          });
        },
          error => {
            console.log(error.error);
            this._snackBar.open(error.error.localizedMessage, '', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: 'error-modalbox'
            })
          });
    });
  }

  applyFilter() {
    const filterValue = this.form.get('filterField')?.value;
    this.chatGroups = this.chatGroups.filter(chatGroup => {
      return chatGroup.name.toLowerCase().includes(filterValue) || chatGroup.name.toLowerCase() == filterValue.toLowerCase() || chatGroup.topic.toLowerCase().includes(filterValue) || chatGroup.topic.toLowerCase() == filterValue;
    });
    this.form.get('filterField')?.setValue('');
  }

  ListPages() {
    this.showGroupParticipants = true;
    this.showContactInfo = false;
    this.contacList.length = 0;
    this.cotalker = '';
    this.pageIdList = [];

    this.chatingService.getChatGroups(this.id, 'public').subscribe(chatGroups => {
      console.log(chatGroups);
      
      const arr = [];
      for (let chat of chatGroups) {
        this.pageIdList.push( chat.id );

        if (chat.adminId == this.id) {
          this.isAdmin = true;
        }
        const chatRoomTableData: ChatRoomTableData = {
          id: chat.id,
          name: chat.name,
          topic: chat.topic,
          adminId: chat.adminId,
          chatType: chat.chatType
        };
        arr.push(chatRoomTableData);
      }
      //this.groupDataSource = new MatTableDataSource(arr);
      this.groupDataSourceShow = true;
      //this.groupDataSource.paginator = this.paginator;
      this.chatGroups = arr;
    });
  }

  deleting(chat: any) {
    this.chatingService.deleteChatRoom(chat.id).subscribe(res => {
      this.ListPages();
    });
  }

  getChatRoomData(chatRoom: any) {
    this.messages.length = 0;
    this.getChatRoomUsers(chatRoom.id);
    this.showChatRoomDataTable = true;
    this.cotalker = chatRoom.name;
    // console.log( chatRoom );

    let chatRoomId;
    if( chatRoom.id == undefined ){
      chatRoomId = chatRoom;
    }else{
      chatRoomId = chatRoom.id;
    }

    this.chatingService.getChatRoomMessages(chatRoomId).subscribe(messages => {
      // console.log( ' messages : ', messages );
      
      for (let message of messages) {
        const messageToShow: Messages = {
          id: message.id,
          userId: message.userId,
          messageText: message.messageText,
          chatRoomId: message.chatRoomId,
          messageTime: message.messageTime,
          seenMessage: [],
          userName: message.userName,
          profilePhoto: message.profilePhoto
        }

        if ( this.id != '0' && !message.deletedParticipantId?.includes(this.id)) {
          this.chatRoomid = message.chatRoomId;
          this.messages.push(messageToShow);
        }

        if ( this.id == '0' ) {
          console.log( ' id == 0 : ' );
          this.messages.push(messageToShow);
        }

        // Do bejme nje request per ta bere mesazhin te pare ( seen )
        this.chatingService.makeMessageAsSeen(this.id, message.id).subscribe();
      }

    });
  }

  getChatRoomUsers(id: string) {
    this.userService.getChatRoomUsers(id).subscribe(participants => {
      // console.log( 'participants : ', participants ); 

      const arr = [];
      for (let participant of participants) {
        const user: UserDataFront = {
          id: participant.id,
          name: '',
          userActive: true,
          profilePhoto: participant.profilePhoto,
          userName: participant.userName,
          city: '',
          languages: '',
          interests: '',
          about: ''
        }
        arr.push(user);
      }
      this.participantDetails = new MatTableDataSource(arr);
      this.participantDetails.paginator = this.paginator1;
    });
  }

  applyFilterActiveUsers(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.participantDetails.filter = filterValue.trim().toLowerCase();
  }

  leaveChatroom() {
    this.chatingService.leaveChat(this.chatRoomid, this.id).subscribe(res => {
      this.chatRoomid = '';
      this._snackBar.open('You are out.', '', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: 'info'
      });
    });
  }

  updatingPage(pageChatRoom: any) {
    // console.log('pageChatRoom : ', pageChatRoom);
    const dialogRef = this.dialog.open(PageUpdateComponent, {
      data: { name: pageChatRoom },
      panelClass: 'search-modalbox'
    });

    dialogRef.afterClosed().subscribe(pageChatRoomData => {
      // console.log(`Dialog pageChatRoomData result: `, pageChatRoomData );
      const chatRoomData: ChatRoomDto = {
        id: pageChatRoomData.id,
        name: pageChatRoomData.name,
        topic: pageChatRoomData.topic,
        adminId: pageChatRoomData.adminId,
        joinCode: '',
        chatType: pageChatRoomData.chatType,
        about: '',
        languages: '',
        participants: []
      };
      this.chatingService.updateChatRoomPage(pageChatRoomData.id, chatRoomData, this.id).subscribe(res => {
        this.ListPages();
      });
    });
  }

  getChatRoomDetails(chatRoomId: string) {
    // console.log(this.chatRoomid);
    const dialogRef = this.dialog.open(ChatRoomDetailsComponent, {
      data: { name: chatRoomId },  // this.chatRoomid
      panelClass: 'chat-room-Info'
    });
  }

  applyContactFilter(filterText: string) {
    // console.log( filterText );
    this.contacList = this.contacList.filter(contact => {
      return contact.userName.toLowerCase().includes(filterText) || contact.userName.toLowerCase() == filterText.toLowerCase();
    });
  }

  searchUsers() {
    const dialogRef = this.dialog.open(SearchUsersComponent, {
      data: { name: this.id },
      panelClass: 'search-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Chat Room ID = ${result}`);
      this.chatRoomid = result;

      this.messages.length = 0;
      this.getChatRoomData(this.chatRoomid)

      if (this.id != '0') {
        this.chatingService.conectUsers(result, this.id).subscribe(chatRoomId => {
          // console.log(`chatRoomId : ${chatRoomId.message}`);
          this.chatRoomid = chatRoomId.message;

          this._snackBar.open('Connected', '', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: 'info'
          });
        },
          error => {
            console.log(error.error);
            this._snackBar.open(error.error.localizedMessage, '', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: 'error-modalbox'
            })
          });
      }
    });
  }

  resetFilterContacts(abc: any) {
    this.ListMessages();
  }

  handleSelection(event: any) {
    console.log(event.char);
    this.emojiText = this.emojiText + event.char;
  }

  deleteMessageForMe(message: any) {
    console.log('message : ', message);
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.chatingService.softDeleteMessage(this.id, message.id).subscribe(res => {
          this.messages = this.messages.filter(messageElement => {
            return messageElement.id != message.id;
          });
        });
      }
    });
  }
}
