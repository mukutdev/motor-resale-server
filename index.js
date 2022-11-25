const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')
require('dotenv').config()
//middleware

app.use(cors())
app.use(express.json())

//mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h5qu391.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{
        const carsCollections = client.db('CarsDatabase').collection('allCars');
        const userCollections = client.db('CarsDatabase').collection('allUsers')

        app.get('/allCars' , async (req, res) =>{
            const query = {}
            const result = await carsCollections.find(query).toArray()
            res.send(result)

        })
        
        // add new user to to database
        app.post('/users' , async(req, res) =>{

            const user = req.body
            const result = await userCollections.insertOne(user)
            res.send(result)
            console.log(result);
        })

        //get users based on accountMode
        app.get('/users/role/:email' , async (req, res)=>{
            const email = req.params.email
            const query = {email : email}
            const result = await userCollections.findOne(query)
            res.send(result)
        })

    }
    finally{

    }

}
run().catch(err =>console.log(err))






app.get('/' , (req , res) => {
    res.send('server is up and running');
})

app.listen(port , ()=>{
    console.log('server listening on port' , port);
})