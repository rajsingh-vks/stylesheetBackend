const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//import client from models
const ClientProfile = require("../models/clientprofile");
//import client from models

// Post ClientProfile
router.post("/clientprofile",  (req, res, next) =>{
    upload(req,res,(err)=>{
        if(err){
            res.json({'err':1,'msg':'Uploading Error'})
        }
        else
        {
           let cname=req.body.cname;
           let fname=req.file.filename;
           let ins=new catModel({'cname':cname,'image':fname});
           ins.save(err=>
            {
                if(err){
                  fs.unlink('./attach/'+fname,(err)=>
                  {
                      if(err){}
                      else 
                      {
                        res.json({'err':1,'msg':'Category Exits'})
                      }
                  })
                }
                else 
                {
                    res.json({'err':0,'msg':'Category Saved'})
                }
            })

        }
    })
})
// Post ClientProfile


module.exports = router;
