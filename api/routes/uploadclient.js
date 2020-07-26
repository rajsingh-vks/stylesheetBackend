const express = require("express");
const router = express.Router();
let catModel=require('../models/uploadclient');


//for attachment Start
router.use("/uploadclient", express.static("attach"));
let multer = require("multer");
let DIR = "./attach";
let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, DIR);
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  }
});

let upload = multer({
  storage: storage
}).single("attach");
//for attachment end


// Start Add Data through API
router.post("/clientdetails", (req, res) => {
  upload(req, res, err => {
    if (err) {
        console.log(err)
      res.json({
        err: 1,
        msg: "Uploading Error"
      });
    } else {
      let cname = req.body.cname;
      let fname = req.file.filename;
      let ins = new catModel({
        cname: cname,
        image: fname
      });
      ins.save(err => {
        if (err) {
          fs.unlink("./attach/" + fname, err => {
            if (err) {
            } else {
              res.json({
                err: 1,
                msg: "Category Exits"
              });
            }
          });
        } else {
          res.json({
            err: 0,
            msg: "Category Saved"
          });
        }
      });
    }
  });
});
// End Add Data through API




module.exports = router;