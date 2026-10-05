import mongoose,{Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const vadioSchema = new Schema({
videoFile :{
    type: string,
    required : true // cloudinary url 
},
thumbnail:{
    type:string,
    required: true,
},
title:{
    type:string,
    required: true,
},
discription:{
    type:string,
    required: true,
},
duration:{
    type:Number,
    required: true, // cloudinary url 
},
views:{
    type : Number,
    default: 0
},
isPublished :{
    type: Boolean,
    default: true
},
owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
}
},{
timestamps:true
})
export const  vadeo = mongoose.model("Vadio", vadioSchema)