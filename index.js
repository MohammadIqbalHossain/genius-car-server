const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n7oeb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollections = client.db("geniusCar").collection("service");
        const orderCollections = client.db('geniusCar').collection("service");


        function verifyJWT(req, res, next) {
            const authHeader = req.headers.autorization;
            if (!authHeader) {
                return res.status(401).send({ Message: 'unautorized access' });
            }
            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.TOKEN_ACCESS_SECRECT, function (err, decoded) {
                if (err) {
                    return res.status(403).send({ message: "access forbidem" });
                }
                console.log("decoded", decoded);
                req.decoded = decoded;
                next();
            })
        }

        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollections.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollections.findOne(query);
            res.send(service);
        })

        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollections.insertOne(newService);
            res.send(result);
        })

        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = serviceCollections.deleteOne(query);
            res.send(result);
        })

        //jwt token code.
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.TOKEN_ACCESS_SECRECT, {
                expiresIn: '1d'
            });
            res.send({ accessToken });
        })

        //order post API.

        app.get('/order', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email;
            const email = req.query.email;
            if (decodedEmail === email) {
                const query = { email: email };
                const cursor = orderCollections.find(query);
                const result = await cursor.toArray();
                res.send(result);
            }
            else {
                return res.status(403).send({ message: "forbidden" })
            }
        })

        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollections.insertOne(order);
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(console.dir);


app.get('/hero', (req, res) => {
    res.send("Running genius sevices");
})
app.get('/', (req, res) => {
    res.send("Hero is running and meets hero ku");
})

app.listen(port, () => {
    console.log("listening", port);
})

