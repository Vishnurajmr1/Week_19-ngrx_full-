import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from 'src/app/Store/Model/User.model';
import { userRegistration } from 'src/app/Store/User/user.actions';
import { passwordChecker } from 'src/app/custom/Validators';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private store:Store,
    private userService: MasterService
  ) {}
  user!: FormGroup;
  submitted: boolean = false;
  formOpen = true;
  isFormSubmitted = false;
  RADIO_LIST=[
    { name: 'male', value: 'male', checked: false },
    { name: 'female', value: 'female', checked: false },
    { name: 'others', value: 'random', checked: false },
  ]
  ngOnInit(): void {
    // Setting default selection in FormControl
    let getCheckedRadio = null;
    this.RADIO_LIST.forEach((o) => {
      if (o.checked) getCheckedRadio = o.value;
    });
    this.user = this.formBuilder.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone:['',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        password: ['', Validators.required],
        gender:[getCheckedRadio,[Validators.required]],
        confirmPassword: ['', Validators.required],
      },
      {
        Validators: passwordChecker('password', 'confirmPassword'),
      }
    );
  }

  get val() {
    return this.user.controls;
  }

  handleSignup() {
    if(this.user.valid){
      const user:User={
        name: this.user.value.name,
        email: this.user.value.email,
        phoneNumber: this.user.value.phone,
        gender: this.user.value.gender,
        password: this.user.value.password,
        confirmPassword:this.user.value.confirmPassword
      }
      console.log(user);
      if(this.user.valid){
        this.store.dispatch(userRegistration({inputdata:user}))
      }
    }
  }

  closeForm() {
    this.formOpen = false;
    this.router.navigateByUrl('');
  }
}
