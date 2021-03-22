const express= require('express');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const port=8000;
const app= express();

const User = require('./models/User');
mongoose.connect('mongodb://localhost/userData')

app.use(bodyParser.json());

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon'; 

// const saltHash = (err, passoword) => {
//   bcrypt.genSalt(saltRounds, (err,salt) => {
//     console.log('salt', salt)
//   bcrypt.hash(password, salt, (err,hash) => {
//     if (err){console.log(err)} else {
//     console.log('hash', hash)
//     return hash
//   }
//   })
// })}

app.listen(port, ()=>{
	console.log(`server is listening on port:${port}`)
})

function sendResponse(res,err,data){
  if (err){
    res.json({
      success: false,
      message: err
    })
  } else if (!data){
    res.json({
      success: false,
      message: "Not Found"
    })
  } else {
    res.json({
      success: true,
      data: data
    })
  }
}
// CREATE
app.post('/users',(req,res)=>{
  console.log(req.body.newData.password)
  bcrypt.hash(req.body.newData.password, saltRounds,
    (err, hash) => {
      User.create({
        name:req.body.newData.name,
        email:req.body.newData.email,
        password:hash
      }, (err,data) => sendResponse(res,err,data)
    )
    })}
)

app.route('/users/:id')
// READ
.get((req,res)=>{
  User.findById(req.params.id,(err,data)=>{
    sendResponse(res,err,data)})
    }
  )
// UPDATE
.put((req,res)=>{
  User.findByIdAndUpdate(
    req.params.id,
    {...req.params.newData},
    {new:true},
    (err, data) => {sendResponse(res,err,data)}
  )
})
// DELETE
.delete((req,res)=>{
  User.findByIdAndDelete(
    req.params.id,
    (err,data) => {sendResponse(res,err,data)})})