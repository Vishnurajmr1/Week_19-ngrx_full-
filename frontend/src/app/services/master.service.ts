import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Store/Model/User.model';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  baseurl='http://localhost:3000/api/v1';
  constructor(private http:HttpClient) { }

  login(data:{email:string,password:string}){
    return this.http.post(this.baseurl+'/auth/login',data)
  }
  signup(data:User){
    console.log(data)
    return this.http.post(this.baseurl+'/auth/signup',data)
  }
  setToken(token: string) {
    return window.sessionStorage.setItem('token', token)
  }
  getToken() {
    return window.sessionStorage.getItem('token')
  }

  deleteToken() {
    return window.sessionStorage.removeItem('token')
  }
}
