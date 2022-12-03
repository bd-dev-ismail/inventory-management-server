const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

//midlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nbna82s.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run(){
    const usersCollection = client.db('inventoryMangement').collection('users');
    //save register user
    app.post('/register', async(req, res)=> {
        const user = req.body;
        // const query = {email: user.email}
        // const oldUser = await usersCollection.findOne(query);
        // if(oldUser.email === user.email){
        //     return res.send({message: "Email Already Exist! Please Enter A New Email!", register: false});
        // }
        // else{
        //      const result = await usersCollection.insertOne(user);
        //      res.send(result);
        // }
         const result = await usersCollection.insertOne(user);
         res.send(result);
       
    });
    //login user
    app.post('/login', async(req, res)=> {
        const user = req.body;  
        const queryEmail = {email: user.email}
        const oldUser = await usersCollection.findOne(queryEmail);
        //if user not found
        if(!oldUser){
            return res.send({email: false})
        };
        //if password not matched
        if(oldUser.password !== user.password){
            return res.send({password: false})
        };
        //if email & pass matched
        if((user.email === oldUser.email) && (user.password === oldUser.password)){
            res.send({login: true});
        }
    })
}
run().catch(error=> console.log(error))




app.get('/', (req, res)=> {
    res.send('Inventory Server is running')
});
app.listen(port, ()=> {
    console.log(`Inventory Server is running on port ${port}`);
})