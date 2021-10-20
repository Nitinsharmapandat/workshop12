const { application } = require('express');
const express=require('express');
const mongoose=require('mongoose');
const User= require("./model");

const app = express();

app.use(express.json());

//db connection
const db=mongoose.connect('mongodb://localhost:27017/mydb', (err, db)=>{
    if(err){
      console.log(err)
    }
    console.log('mongoose connected');
  }); 

  app.get('/users', async (req, res) => {
         let {page,size}=req.query;

       if(!page){
         page=1;
       }
       if(!size){
         size=5;
       }
      
       const limit=parseInt(size);
       const skip=(page-1)*size;

       const resultUsers=await User.find().limit(limit).skip(skip);
       res.send({page,size,data:resultUsers});
  });

  app.get("/users/:field",async (req,res)=>{
 let {page,size}=req.query;

    if(!page){
      page=1;
    }
    if(!size){
      size=5;
    }
   
    const limit=parseInt(size);
    const skip=(page-1)*size; 

       let nameVal=0;
      if(req.params.field==="name"){
        nameVal=1;
      }else{
        res.send({message:"result not found"})
      }

       const resultUsers=await User.find({},{'_id' : 0, 'name' : nameVal}).limit(limit).skip(skip);
       res.send({page,size,key:resultUsers});
  });
  app.get("/users/search/:field",async (req,res)=>{

    let {page,size}=req.query;

       if(!page){
         page=1;
       }
       if(!size){
         size=5;
       }
      
       const limit=parseInt(size);
       const skip=(page-1)*size;

    const searchResult = await User.find({name: {$regex: RegExp('^'+req.params.field+'.*', 'i')}}).limit(limit).skip(skip).exec();

    res.send({page,size,search:searchResult});
  });

  app.listen(8000, console.log('Server started'));