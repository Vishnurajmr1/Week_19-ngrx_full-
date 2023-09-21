import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  passwordChangedAt:Date;
  imageUrl: string;
  gender: string;
  role:string;
  is_Admin:boolean;
  is_Blocked:boolean;
  comparePasswordInDb: (password: string, passwordInDB: string) => Promise<boolean>;
   isPasswordChanged(JWTTimestamp:any):Promise<boolean>;
}

// Define the allowed values for the "gender" field
const allowedGenders = ["male", "random", "female"];

//name,email,password,confirmpassword,photo
const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email."],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please enter a phone number"],
    validate: {
      validator: function (value: string) {
        return validator.isMobilePhone(value, "any", { strictMode: false });
      },
      message: "Please enter a valid phone number",
    },
  },
  gender: {
    type: String,
    enum: allowedGenders,
    default: "random",
  },
  imageUrl: String,
  password: {
    type: String,
    required: [true, "Please enter a password."],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password."],
    validate: {
      validator: function (value: string) {
        return (this as any).password == value;
      },
      message: "Password & Confirm Password does not match!",
    },
  },
  passwordChangedAt:{
    type:Date,
    select:false
  },
  is_Admin:{
    type:Boolean,
    default:false ,
    select:false                                                    
  },
  is_Blocked:{
    type:Boolean,
    default:false, 
    select:false                                                 
  },
  role:{
    type:String,
    enum:['user','admin'],
    default:'user'
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  //encrypt the password before saving it

  this.password = await bcrypt.hash(this.password!, 12);

  //remove confirm password before save
  this.set("confirmPassword", undefined, { strict: false });
  next();
});

userSchema.methods.comparePasswordInDb=async function(pswd:string,pswdDb:string) {
    return await bcrypt.compare(pswd,pswdDb);
}
userSchema.index({name:'text'});
userSchema.methods.isPasswordChanged=async function(JWTTimestamp:any){
  if(this.passwordChangedAt){
    const pswdChangedTimestamp=Math.floor(this.passwordChangedAt.getTime() /1000);
    console.log(this.passwordChangedAt,JWTTimestamp)

    return JWTTimestamp<pswdChangedTimestamp;
  }
  return false;
}
 
export const User = mongoose.model<IUser>("User", userSchema);
