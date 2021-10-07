import { AfterViewInit, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PrivateMessages } from '../models/privateMessages.interface';
import { ChatingService } from '../services/chating.service';
import { UserServiceService } from '../services/user-service.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {  // AfterViewInit, OnChanges

  displayedColumns: string[] = ['userName', 'delete'];
  dataSource !: MatTableDataSource<PrivateMessages>;

  @Input()
  messages: PrivateMessages[] = [];

  @Input()
  n : number = 0;

  @Input()
  id !: string;

  length: any = 0;
  pageEvent !: PageEvent;

  // @ViewChild(MatPaginator) 
  // paginator !: MatPaginator

  @Output()
  contact : EventEmitter<any> = new EventEmitter<any>();

  @Output()
  deleteContactId : EventEmitter<string> = new EventEmitter<string>();

  @Output()
  filterText : EventEmitter<string> = new EventEmitter<string>();

  @Output()
  resetFilterField : EventEmitter<string> = new EventEmitter<string>();

  form !: FormGroup;

  constructor( public fb: FormBuilder, private userService: UserServiceService, private chatingService: ChatingService) { }

  // ngOnChanges(changes: SimpleChanges): void {
  //   // console.log("this.messages", this.messages.length );
  //   // console.log("this.messages", this.messages );
  //   // console.log("this.messages", this.messages.length );

  //   // const messageArray = [];
  //   // for (let messageElement of this.messages) {
  //   //   messageArray.push(messageElement);
  //   // }
  //   //this.dataSource = new MatTableDataSource(messageArray);

  // }


  // ngAfterViewInit() {
  //   // this.dataSource.paginator = this.paginator;
  //   // console.log("this.dataSource", this.dataSource );
  // }

  ngOnInit(): void {
    this.form = this.fb.group({
      filterField: new FormControl(null),
    });
  }

  deleteContact(id: string) {
    for (let i = 0; i < this.messages.length; i++) {
      if (this.messages[i].id == id) {
        this.messages.splice(i, 1);
      }
    }
    this.dataSource = new MatTableDataSource(this.messages);
    this.length = this.messages.length;
    this.deleteContactId.emit(id);

  }

  seeMessages( contact: any ) {
    // console.log( contact );
    // console.log( contact.userName );
    const contactElement : any = {
      id : contact.id,
      userName : contact.userName
    };
    this.contact.emit( contactElement );
    // this.contact.emit(contact.id);
  }

  applyFilter() {  // event: Event
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    const filterValue = this.form.get('filterField')?.value;
    this.form.get('filterField')?.setValue("");
    this.filterText.emit( filterValue );
  }

  resetFilter(){
    this.resetFilterField.emit("");
  }

}
