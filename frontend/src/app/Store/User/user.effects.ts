import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MasterService } from 'src/app/services/master.service';
import {
  LOGIN_USER,
  userLoginSuccess,
  userRegistration,
  userRegistrationSuccess,
} from './user.actions';
import { Router } from '@angular/router';
import { switchMap, of, catchError, map, tap } from 'rxjs';
import { showalert } from '../Global/App.action';
import { UserModel } from '../Model/User.model';

@Injectable()
export class userEffects {
  constructor(
    private action$: Actions,
    private userService: MasterService,
    private router: Router
  ) {}

  _registerUser = createEffect(() =>
    this.action$.pipe(
      ofType(userRegistration),
      switchMap((action) => {
        return this.userService.signup(action.inputdata).pipe(
          switchMap((data) => {
            this.router.navigateByUrl('/login');
            return of(
              userRegistrationSuccess({ inputdata: action.inputdata }),
              showalert({
                message: 'Created successfully',
                resulttype: 'pass',
              })
            );
          }),
          catchError((_error) =>
            of(
              showalert({
                message: 'Failed to create customer',
                resulttype: 'fail',
              })
            )
          )
        );
      })
    )
  );
  //user login with email and password
  _loginUser = createEffect(() =>
    this.action$.pipe(
      ofType(LOGIN_USER),
      switchMap((action) =>
        this.userService.login(action).pipe(
          map((res: any) => {
            localStorage.setItem('token', res.token);
            localStorage.setItem('admin', 'false');
            localStorage.setItem('userDetails', JSON.stringify(res.user));
            return userLoginSuccess({
              inputdata: res.user,
              token: res.token,
            });
          })
        )
      ),
      catchError((_error)=>
      of(
        showalert({
            message: 'Invalid Credentials',
            resulttype: 'fail',
        })
      )
      )
    )
  );
  _loginSuccess = createEffect(() =>
    this.action$.pipe(
      ofType(userLoginSuccess),
      tap(() => {
        this.router.navigate(['/']);
      })
    ),
    { dispatch: false }
  );
}
