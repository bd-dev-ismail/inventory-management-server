const express = require('express');
require('dotenv').config();
const cors = require('cors');
const jwt = require("jsonwebtoken");
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
    const categoriesColleciton = client.db('inventoryMangement').collection('categories');
    const productsColleciton = client.db('inventoryMangement').collection('products');

    //jwt 
    app.get('/jwt', async(req, res)=> {
        const email = req.query.email;
        
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {expiresIn: '30d'});
        res.send({token});
    })
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
         res.send({result, user: user.email});
       
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
            res.send({login: true, user: user.email});
        }
    });
    //get categoreis
    app.get('/categories', async(req, res)=> {
        const query = {};
        const result = await categoriesColleciton.find(query).toArray();
        res.send(result)
    });
    //add categorie
    app.post("/categories", async (req, res) => {
      const name = req.body;
      const result = await categoriesColleciton.insertOne(name);
      res.send(result);
    });
    //add Products
    app.post('/products', async(req, res) => {
        const product = req.body;
        const result = await productsColleciton.insertOne(product);
        res.send(result);
    });
    //find porudct by id
    app.get('/products/:id', async(req, res)=> {
        const id = req.params.id;
        const query = {
          ProductCategoryId: id,
        };
        const result = await productsColleciton.find(query).toArray();
        res.send(result)
    });
    //find user data 
    app.get('/user', async(req, res)=> {
        const email = req.query.email;
        const query = {email: email};
        const result = await usersCollection.findOne(query);
        res.send(result)
    })
}
run().catch(error=> console.log(error))




app.get('/', (req, res)=> {
    res.send('Inventory Server is running')
});
app.listen(port, ()=> {
    console.log(`Inventory Server is running on port ${port}`);
})