import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
// import * as Peer from 'peerjs';
import { ChatingService } from '../services/chating.service';
import { LoginDataService } from '../services/login-data.service';
import { UserServiceService } from '../services/user-service.service';
// import * as SimplePeer from 'simple-peer';
// import { WebrtcService } from '../services/webrtc.service';

// import Peer from "peerjs"

// declare const SimplePeer: any;


@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss']
})
export class CallComponent implements OnInit {

  form !: FormGroup;
  form1 !: FormGroup;
  sendSms !: FormGroup;

  // a !: any;
  peer1 !: any;
  peer2 !: any;

  // targetpeer : any ;
  peer: any;
  anotherId: any;

  constructor(public fb: FormBuilder, private route: ActivatedRoute, private logiData: LoginDataService, private router: Router,
    private userService: UserServiceService, public dialog: MatDialog,
    private chatingService: ChatingService, private _snackBar: MatSnackBar) { }  // , private peer : WebrtcService

  ngOnInit(): void {

    this.form = this.fb.group({
      filterField: new FormControl(null),
    });

    this.form1 = this.fb.group({
      filterField: new FormControl(null),
    });

    this.sendSms = this.fb.group({
      sms: new FormControl(null),
    });

  }

  // ngOnInit(): void {

  //   this.form = this.fb.group({
  //     filterField: new FormControl(null),
  //   });

  //   this.form1 = this.fb.group({
  //     filterField: new FormControl(null),
  //   });

  //   this.sendSms = this.fb.group({
  //     sms: new FormControl(null),
  //   });


  //   console.log('before peer ');

  //   this.peer1 = new SimplePeer({
  //     // initiator: true,
  //     initiator: location.hash == '#init',
  //     trickle: false
  //   });

  //   // this.peer2 = new SimplePeer();

  //   // this.peer = new Peer();

  //   // {
  //   //   host: 'localhost',
  //   //   // port: 5001
  //   // }

  //   console.log('after peer ');
  //   console.log('pear id : ', this.peer1);
  //   console.log('pear id : ', this.peer1._id);
  //   console.log('\n \n ');


  //   this.peer1.on('signal', (data: any) => {
  //     // when peer1 has signaling data, give it to peer2 somehow
  //     console.log(' peer 1 signal  :  ', data);
  //     console.log(' peer 1 signal  :  ', JSON.stringify(data) );
  //     this.form.get('filterField')?.setValue( JSON.stringify(data) );
  //     // this.peer2.signal(data)
  //   });

  //   // this.peer2.on('signal', (data: any) => {
  //   //   // when peer2 has signaling data, give it to peer1 somehow
  //   //   console.log(' peer 2 signal :  ', data);
  //   //   this.peer1.signal(data)
  //   // });

  //   this.peer1.on('connect', () => {
  //     // wait for 'connect' event before using the data channel
  //     console.log(' peer 1 connect');
  //     this.peer1.send('hey peer2, how is it going?')
  //   });

  //   // this.peer2.on('data', (data: any) => {
  //   //   // got a data channel message
  //   //   console.log('got a message from peer1: ' + data)
  //   // });

  //   // this.peer2.on('error', (err: any) => {
  //   //   console.log('err : ', err);
  //   // });

  //   this.peer1.on('error', (err: any) => {
  //     console.log('err : ', err);
  //   });

  //     this.peer1.on('data', ( data : any ) => {
  //       // got a data channel message
  //       console.log('got a message from peer1: ' + data)
  //     });


  //   // this.peer.on('connection', (conn: any) => {
  //   //   conn.on('data', (data: any) => {
  //   //     // Will print 'hi!'
  //   //     console.log(data);
  //   //   });
  //   //   conn.on('open', () => {
  //   //     conn.send('hello!');
  //   //   });
  //   // }); 

  // }

  // Lidhet dhe dergon nje mesazh Hi
  connect() {
    console.log('connect ');
  }

  connect1() {
    // this.peer1.signal(this.form1.get('filterField')?.value)
  }

  sendsms() {
    console.log('sendsms : ');
    console.log(this.sendSms.get('sms')?.value);
    // this.peer1.send(this.sendSms.get('sms')?.value);
  }


}

