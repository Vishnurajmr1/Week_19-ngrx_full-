import { createReducer, on } from "@ngrx/store";
import { userState } from "./user.state";
import { userLoginSuccess, userRegistrationSuccess } from "./user.actions";


const _UserReducer=createReducer(
    userState,
    //user registration
    on(userRegistrationSuccess,(state,action)=>{
        const _newdata={...action.inputdata}
        console.log(_newdata)
        return {
            ...state,
            list:[...state.list,_newdata],
            errormessage:'',
            token:'',
        }
    }),
    on(userLoginSuccess,(state,action)=>{
        return{
            ...state,
            list:[...state.list],
            user:action.inputdata,
            token:action.token
        }
    })

)
export function UserReducer(state:any,action:any){
    return _UserReducer(state,action);
}