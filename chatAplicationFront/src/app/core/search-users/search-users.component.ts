import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ChatRoomTableData } from '../models/chatRoomTableData.interface';
import { GroupSearchField } from '../models/groupSearchField.interface';
import { ProfileSearchParameters } from '../models/profileSearchParameters.interface';
import { UserDataFront } from '../models/userDataFront.interface';
import { ChatingService } from '../services/chating.service';
import { UserDataService } from '../services/user-data.service';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.scss']
})
export class SearchUsersComponent implements OnInit {

  form !: FormGroup;
  gropupSearch !: FormGroup;
  cities !: any[];
  languages !: any[];
  interests !: any[];
  isLogedIn: boolean = false;

  pageSize: any = 5;
  pageIndex: any = 0;
  pageLength: any = 0;

  userDataFront: UserDataFront[] = [];
  groupData: ChatRoomTableData[] = [];

  userDataDisplayedColumns: string[] = ['profilePhoto', 'userName', 'userActive', 'more'];
  displayedColumns: string[] = ['name', 'topic', 'more'];
  // dataSource !: MatTableDataSource<ChatRoomTableData>;

  @ViewChild(MatPaginator)
  userPaginator !: MatPaginator;

  @ViewChild(MatPaginator)
  pagePaginator !: MatPaginator;

  // userPaginatorShow : string = 'none';
  userShow: boolean = false;
  pageShow: boolean = false;
  groupShow: boolean = false;

  constructor(public fb: FormBuilder, private userData: UserDataService, private userService: UserServiceService,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }, private chatingService: ChatingService) { }


  // ngAfterViewInit(): void {
  // }

  ngOnInit(): void {
    // console.log('id : ', this.data.name );

    this.userService.checkUserStatus(this.data.name).subscribe(userStatus => {
      this.isLogedIn = userStatus;
    });

    this.form = this.fb.group({
      userName: new FormControl(null),
      interes: new FormControl(null),
      language: new FormControl(null),
      city: new FormControl(null)
    });

    this.gropupSearch = this.fb.group({
      name: new FormControl(null),
      topic: new FormControl(null),
      language: new FormControl(null)
    });

    this.userData.getCities().subscribe(cities => {
      this.cities = cities;
    });

    this.userData.getInterests().subscribe(interests => {
      this.interests = interests;
    });

    this.userData.getLanguages().subscribe(languages => {
      this.languages = languages;
    });
  }

  submitForm() {
    this.groupData.length = 0;
    this.userShow = true;
    this.pageShow = false;
    this.groupShow = false;

    const profileSearchFields: ProfileSearchParameters = {
      userName: this.form.get('userName')?.value,
      city: this.form.get('city')?.value,
      languages: this.form.get('language')?.value,
      interests: this.form.get('interes')?.value
    }
    this.userService.search(profileSearchFields, this.pageIndex, this.pageSize )
      .subscribe(res => {
        console.log(res);

        this.pageLength = res.totalElements - 1;

        this.userDataFront = res.content;
        this.userDataFront = this.userDataFront.filter(element => element.id != this.data.name);

        for (let userData of this.userDataFront) {
          if (userData.profilePhoto == '') {
            userData.profilePhoto = "../../assets/images/noImage.jpg"; // 'https://material.angular.io/assets/img/examples/shiba2.jpg';
          }
        }
      })
  }

  searchGroups() {
    this.groupData.length = 0;
    this.userDataFront.length = 0;

    this.userShow = false;
    this.pageShow = false;
    this.groupShow = true;

    const profileSearchFields: GroupSearchField = {
      id: this.data.name,
      name: this.gropupSearch.get('name')?.value,
      topic: this.gropupSearch.get('topic')?.value,
      chatType: 'private',
      languages: this.gropupSearch.get('language')?.value,
    };

    this.chatingService.searchGroups(profileSearchFields, this.pageIndex, this.pageSize)
      .subscribe(privateGroups => {
        // console.log(privateGroups);
        this.pageLength = privateGroups.totalElements;

        for (let group of privateGroups.content) {
          const chatRoomTableData: ChatRoomTableData = {
            id: group.id,
            name: group.name,
            topic: group.topic,
            adminId: group.adminId,
            chatType: group.chatType
          };

          this.groupData.push(chatRoomTableData);
        }
      });
  }

  searchPages() {

    this.groupData.length = 0;
    this.userDataFront.length = 0;

    this.userShow = false;
    this.pageShow = true;
    this.groupShow = false;

    const profileSearchFields: GroupSearchField = {
      id: this.data.name,
      name: this.gropupSearch.get('name')?.value,
      topic: this.gropupSearch.get('topic')?.value,
      chatType: 'public',
      languages: this.gropupSearch.get('language')?.value,
    };

    this.chatingService.searchGroups(profileSearchFields, this.pageIndex, this.pageSize)
      .subscribe(privateGroups => {
        // console.log(privateGroups);
        this.pageLength = privateGroups.totalElements;

        for (let group of privateGroups.content) {
          const chatRoomTableData: ChatRoomTableData = {
            id: group.id,
            name: group.name,
            topic: group.topic,
            adminId: group.adminId,
            chatType: group.chatType
          };

          this.groupData.push(chatRoomTableData);
        }
      });
  }

  onPagePaginationChange(event: any) {
    // console.log(event);
    // console.log(this.pagePaginator);

    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.pagePaginator.pageIndex = event.pageIndex;
    this.pagePaginator.pageSize = event.pageSize;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    if( this.pageShow ){
      this.searchPages();
    }

    if( this.groupShow ){
      this.searchGroups();
    }

    if( this.userShow ){
      this.submitForm();
    } 
  }

}
