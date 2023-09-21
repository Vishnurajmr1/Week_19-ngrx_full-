import {HttpClient,HttpHeaders} from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';


interface userRes {
  name: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent  implements OnInit,AfterViewInit{
  message:string='';
  email='';
  constructor(
    private http:HttpClient
  ){}
  ngOnInit(): void {
    const storedUser=localStorage.getItem('userDetails');
    if(storedUser){
      const userData=JSON.parse(storedUser)
      console.log(userData)
      this.message=userData.name
      this.email=userData.email
    }else{
      this.message="Please login"
    }
  }
  ngAfterViewInit(): void {

  }

}
