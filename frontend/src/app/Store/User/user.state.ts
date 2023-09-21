import { UserModel } from "../Model/User.model";

export const userState:UserModel={
    list: [],
    user: {
        _id: '',
    name:'',
    email:'',
    phoneNumber:'',
    gender:'',
    imageUrl:'',
    password:'',
    confirmPassword:'',
    is_Admin:false,
    is_Blocked:false,
    role:'user'
    },
    token: "",
    errormessage: ""
}