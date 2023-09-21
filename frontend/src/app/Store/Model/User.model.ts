export interface User{
    _id?: string|Object;
    name:string,
    email:string,
    phoneNumber:string,
    gender:string,
    imageUrl?:string,
    password:string,
    confirmPassword:string,
    is_Admin?:boolean,
    is_Blocked?:boolean,
    role?:string
}

export interface UserToken{
    token:string
}

export interface UserModel{
    list:User[],
    user:User
    token:string
    errormessage:string;
}