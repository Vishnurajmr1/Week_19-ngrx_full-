import { createAction, props } from "@ngrx/store";
import {User} from '../Model/User.model'


export const REGISTER_USER='[user] user registration';
export const REGISTER_USER_SUCCESS='[user] user registration success';

export const LOGIN_USER='[user] user login';
export const LOGIN_USER_SUCCESS='[user] user login success';

//user registration

export const userRegistration=createAction(
    REGISTER_USER,
    props<{inputdata:User}>()
)
export const userRegistrationSuccess = createAction(
    REGISTER_USER_SUCCESS,
    props<{inputdata: User }>()
  );

export const userLogin=createAction(
    LOGIN_USER,
    props<{email:string,password:string}>()
)

export const userLoginSuccess=createAction(
    LOGIN_USER_SUCCESS,
    props<{inputdata:User,token:string}>()
)