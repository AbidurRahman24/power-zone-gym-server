const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const fs = require('fs-extra')
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(fileUpload());
app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dyzwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const reviewsCollection = client.db("powerFitnessGym").collection("Reviews");
    const serviceCollection = client.db("powerFitnessGym").collection("Service");
    const OrderCollection = client.db("powerFitnessGym").collection("order");
    app.post('/addReview', (req, res) => {
        const review = req.body;
        reviewsCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });
    app.get('/reviews', (req, res) => {
        reviewsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })



    app.post('/addService', (req, res) => {
        const file = req.files.file;
        const title = req.body.title;
        const email = req.body.email;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64');
        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        serviceCollection.insertOne({ title, email, description, image })
            .then(result => {
                res.send(result.insertedCount > 0);
                console.log(title, email, description);
            })
    });
    app.get('/services', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/services/:id', (req, res) => {
        serviceCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })


    app.post('/addOrder', (req, res) => {
        const order = req.body;
        
        OrderCollection.insertOne(order)
            .then(result => {
               
                res.send(result.insertedCount > 0);
            })
    });
    app.get('/orders', (req, res) => {
        OrderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })



    app.delete('/delete/:id', (req,res)=>{
        // console.log(res,params.id);
        serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
         .then(result =>{
          //  console.log(result.deletedCount);
           res.send(result.deletedCount > 0)
         })
       })


       app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        serviceCollection.find({ email: email })
            .toArray((err, doctors) => {
                res.send(doctors.length > 0);
            })
    })

})





app.get('/', (req, res) => {
    res.send('Hello World!')
})


const port = process.env.PORT || 5000
app.listen(port, () => {
    
    
})