import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-page-update',
  templateUrl: './page-update.component.html',
  styleUrls: ['./page-update.component.scss']
})
export class PageUpdateComponent implements OnInit {

  form !: FormGroup;
  
  constructor(public fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: { name: any }) { }

  ngOnInit(): void {
   
    this.form = this.fb.group({
      name: new FormControl( this.data.name.name ),
      topic: new FormControl( this.data.name.topic ),
      id: new FormControl( this.data.name.id ),
      chatType: new FormControl( this.data.name.chatType ),
      adminId: new FormControl( this.data.name.adminId ),
      // about : new FormControl( null )
    });

    this.form.controls['chatType'].disable() ;
    this.form.controls['adminId'].disable() ;
    this.form.controls['id'].disable() ;
  }

}
