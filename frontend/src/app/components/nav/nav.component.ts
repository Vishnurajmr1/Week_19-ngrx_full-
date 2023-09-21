import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import { Emitters } from 'src/app/emitters/emitters';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  authenticated=false;
  constructor(private router:Router,private userService:MasterService){}

  ngOnInit(): void {
    Emitters.authEmitter.subscribe((auth:boolean)=>{
      this.authenticated=auth;
    })
  }
  login(){
    this.router.navigateByUrl('login')
  }
  logout(){
    this.userService.deleteToken();
    this.authenticated=false;
    this.router.navigateByUrl('login');
    Emitters.authEmitter.emit(false);
  }
  isLoggedIn(){
    return this.userService.getToken()
  }

}

