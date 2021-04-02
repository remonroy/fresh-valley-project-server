const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId
require('dotenv').config();


const app = express()
const port = 4500
app.use(cors())
app.use(express.json())





const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wxd1m.mongodb.net/${process.env.BD_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("freshValley").collection("data");
  const orderCollection = client.db("freshValley").collection("order");
  app.post('/addEvent',(req,res)=>{
    const newEvent=req.body;
    collection.insertOne(newEvent)
    .then(result=>{
      res.send(result.insertedCount > 0);
    })
  })

  app.get('/products',(req,res)=>{
    collection.find({})
    .toArray((err,document)=>{
      res.send(document)
    })
  })
  app.get('/singleProducts/:id',(req,res)=>{
    const id=req.params.id
    collection.find({_id:ObjectId(id)})
    .toArray((err,document)=>{
      res.send(document)
    })
  })
  app.post('/addOrder',(req,res)=>{
    const product=req.body;
    orderCollection.insertOne(product)
    .then(result=>{
      console.log(result);
    })
  })
  app.get("/showOrder",(req,res)=>{
    const email=req.query.email;
    orderCollection.find({email:email})
    .toArray((err,document)=>{
      res.send(document)
      // res.redirect("/order")
    })
  })
  app.get('/ollorderView',(req,res)=>{
    collection.find({})
    .toArray((err,document)=>{
      res.send(document)
    })
  })
  app.delete('/delete/:id',(req,res)=>{
    const idinfo=req.params.id;
    console.log(idinfo);
    collection.deleteOne({_id:ObjectId(idinfo)})
    .then(document=>{
      console.log(document);
    })
  })
  

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)