export interface User{
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

export interface UserModel{
    list:User[],
    userojb:User,
    errormessage:string
}