import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatingService } from '../services/chating.service';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  form !: FormGroup;
  // cities !: any[];
  languages !: any[];
  interests !: any[];
  matcher = new ErrorStateMatcher();

  constructor( @Inject(MAT_DIALOG_DATA) public data: { name: string },
  public fb: FormBuilder, private userData: UserDataService, private chatingService: ChatingService, ) { } //  private userService: UserServiceService,

  ngOnInit(): void {
    // let btn = document.getElementById("ok-btn");
    // btn?.click();

    this.form = this.fb.group({
      name: new FormControl(null, Validators.required ),
      topic: new FormControl(null, Validators.required ),
      language: new FormControl(null, Validators.required ),
      about: new FormControl(null),
      joinCode : new FormControl(null, Validators.required )
    });
   
    this.userData.getLanguages()
      .subscribe(languages => {
        this.languages = languages;
      });
  }


}
