import { Injectable } from '@angular/core';
// import * as Peer from 'peerjs';
// import Peer from "peerjs"

// var Peer = require('simple-peer')
// var peer1 = new Peer({ initiator: true })
// var peer2 = new Peer()


@Injectable({
  providedIn: 'root'
})
export class WebrtcService {

//   // targetpeer : any ;
//   peer: any;
//   anotherId: any;

//   constructor() { }

//   connect() {

//     this.peer = new Peer();
//     console.log( this.peer.id );

//     this.peer.on('connection', (conn : any) => {
//       conn.on('data', (data : any) => {
//         // Will print 'hi!'
//         console.log(data);
//       });
//       conn.on('open', () => {
//         conn.send('hello!');
//       });
//     });

//     const conn = this.peer.connect( this.anotherId );
//     conn.on('open', () => {
//       conn.send('hi!');
//     });

//  }
  
}
