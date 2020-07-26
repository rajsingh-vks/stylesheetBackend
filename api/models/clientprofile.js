const mongoose=require('mongoose');
var clientprofileSchema = new mongoose.Schema({
    clientprofilename:{type:String,unique:true},
    clientprofileimage: {type:String,required:true},
    created_at:{type:Date,default:Date.now()}
  });
  
module.exports=mongoose.model('clientprofile', clientprofileSchema);