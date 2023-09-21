import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserModel } from "../Model/User.model";



const getUserState=createFeatureSelector<UserModel>('user');

export const getUserlist=createSelector(getUserState,(state)=>{
    return state.list;
})

export const getUser=createSelector(getUserState,(state)=>{
    return state.user;
})