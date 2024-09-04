import mongoose from "mongoose";
import validator from "validator";



interface IUser extends Document{
  _id:string;
  name:string;
  photo:string;
  email:string,
  role:"admin" | "user";
  gender:"male"|"female";
  dob:Date;
  createdAt:Date;
  updatedAt:Date;
  age:number
}




const schema = new mongoose.Schema(
    {
      _id:{
        type:String,
        required:[true,"please enter ID"]
      },
      name:{
        type:String,
        required:[true,"please enter name"]
      },
      email:{
        type:String,
        unique:[true,"Email"],
        required:[true,"please enter name"],
        validator:validator.default.isEmail
      },
      photo:{
        type:String,
        required:[true,"please add photo"]
      },
      role:{
        type:String,
        enum:["admin","user"],
        default:"user"
      },
      gender:{
        type:String,
        enum:["male","female"],
        required:[true,"please enter gender"]
      },
      dob:{
        type:Date,
        required:[true,"please enter date of birth"]
      },
    },
    {
        timestamps:true
    }
);

schema.virtual("age").get(function(){
    const today = new Date();
    let dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear()

    if(today.getMonth() < dob.getMonth() || today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate() ){
        age--
    }
    return age;
})



export const User = mongoose.model<IUser>("User",schema);



