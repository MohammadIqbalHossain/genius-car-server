const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n7oeb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
     await client.connect();
     const serviceCollections = client.db("geniusCar").collection("service");

     app.get('/service', async (req,res) => {
        const query = {};
        const cursor = serviceCollections.find(query);
        const result = await cursor.toArray();
        res.send(result);
     });

     app.get('/service/:id', async (req, res) => {
         const id = req.params.id;
         const query = {_id: ObjectId(id)};
         const service = await serviceCollections.findOne(query);
         res.send(service); 
     })

     app.post('/service', async(req, res) => {
         const newService = req.body;
         const result = await serviceCollections.insertOne(newService);
         res.send(result);
     })

     app.delete('/service/:id', async (req, res) => {
         const id = req.params.id;
         const query = {_id:ObjectId(id)};
         const result = serviceCollections.deleteOne(query);
         res.send(result);
     }) 

  }
  finally{

  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Hello");
})

app.listen(port, () => {
    console.log("listening", port);
})

