import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-change-field',
  templateUrl: './change-field.component.html',
  styleUrls: ['./change-field.component.scss']
})
export class ChangeFieldComponent implements OnInit {

  form !: FormGroup;
  
  constructor( public fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: { name: string } ) { }

  ngOnInit(): void {
    console.log( this.data.name );

    this.form = this.fb.group({
      value: new FormControl(this.data.name),
    }); 
  }

}
