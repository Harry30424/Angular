
import { Component } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { GitHubService } from './github.service';
import { FormControl} from '@angular/forms';
import { filter,debounceTime,distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
  <input class="form-control" type="search" [formControl]="searchControl">
  <h3>GitHub User Results</h3>
  <div *ngIf="isLoding">
    <i class="fa fa-spinner fa-spin fa-3x"></i>
  </div>

  <div *ngFor="let user of users" class="media">
    <div class="media-left">
      <a href="{{user.html_url}}">
        <img class="media-object img" src="{{user.avatar_url}}" alt="">
      </a>
    </div>
    <div class="media-body">
      <h4 class="media-heading">{{user.login}}</h4>
      Score:{{user.score}}
    </div>
  </div>
  `,
  providers:[GitHubService],
  styles:[`.img{
    position:relative;
    float:screenLeft;
    width:100px;
    height:100px;
    background-position: 50% 50%;
    background-repeat:no-repeat;
    backgroung-size: cover

  }
  `],
})
export class AppComponent {
  // title = 'Mygithub';
  isLoding = false;//一開始還沒輸入就不loading
  users=[];
  searchControl = new FormControl();

  constructor(private _githubService: GitHubService){
    // this._githubService.getGitHubData('greg')
    // .subscribe(data => console.log(data.items))//get only items
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.searchControl.valueChanges
    .pipe(filter(text=>text.length>=3),debounceTime(400),distinctUntilChanged()).subscribe(value=>{
      this.isLoding=true;//輸入完才loading
      this._githubService.getGitHubData(value)
    .subscribe(data => {
      this.isLoding = false;
      this.users = data.items;
      // console.log(data.items)})//get only items
    });
    })


  }
}
