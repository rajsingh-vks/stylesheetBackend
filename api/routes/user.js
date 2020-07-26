const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let UserModel=require('../models/users');
const fs = require('fs')

//multer//
// router.use('/',express.static('attach'))
// let multer = require ('multer');
// let DIR="attach";
// let storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null,DIR)
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now()+ '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
//     }
//   })
  
//   let upload = multer({ storage: storage }).single('attach');



//multer//

//import user from models
const User = require("../models/users");
//import user from models

// Post Data through signup
router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});
// Post Data through signup

// Login Data through signup
router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
        message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
            return res.status(401).json({
              error: true
            });
        } 
        if (result) {
            const token = jwt.sign(
                {
                  email: user[0].email,
                  userId: user[0]._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                }
            );
            return res.status(200).json({
              message: "Successful",
              err: "0",
              userDetail:{
                token: token,
                email: req.body.email
               }
            });
        }  
        res.status(401).json({
            message: "Auth failed"
        });      
      });
    })
   .catch(err => {
     console.log(err);
     res.status(500).json({
        error: err
    });
   });
});
// Login Data through signup

// Delete Data through signup
router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
// Delete Data through signup


//File upload

router.post('/upload',(req,res)=>
{
    upload(req,res,(err)=>
    {
        if(err){
            res.json({'err':1,'msg':'Uploading Error'}),
            console.log(err)
        }
        else
        {
           let fname=req.file.filename;
           let ins=new UserModel({'images':fname});
           ins.save(err=>
            {
                if(err){
                  fs.unlink('attach/'+fname,(err)=>
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
//File Upload
module.exports = router;
