import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,FormControl, Validators } from '@angular/forms';
import {Router} from '@angular/router'
import { Store } from '@ngrx/store';
import { userLogin } from 'src/app/Store/User/user.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit{
  userlogin!:FormGroup;
  formOpen=true;
  constructor(private router:Router,private store:Store){}
  ngOnInit(): void {
    this.userlogin=new FormGroup({
      email:new FormControl('',[Validators.required,Validators.email]),
      password:new FormControl('',[Validators.required,Validators.minLength(8)])
    })
  }

  get val(){
    return this.userlogin.controls;
  }

  handleLogin(){
    console.log(this.userlogin);
    if(this.userlogin.valid){
      this.store.dispatch(userLogin({email:this.userlogin.value.email,password:this.userlogin.value.password}))
    }
  }

  closeForm(){
    this.formOpen=false;
    this.router.navigateByUrl('');
  }
}
