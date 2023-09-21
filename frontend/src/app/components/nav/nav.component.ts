import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  constructor(private router:Router,private userService:MasterService){}

  ngOnInit(): void {
   
  }

  login(){
    this.router.navigateByUrl('login')
  }
  logout(){
    this.userService.deleteToken();
    this.router.navigateByUrl('login');
  }

  isLoggedIn(){
    return this.userService.getToken()
  }

}

