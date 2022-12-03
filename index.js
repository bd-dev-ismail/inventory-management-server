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
}
run().catch(error=> console.log(error))




app.get('/', (req, res)=> {
    res.send('Inventory Server is running')
});
app.listen(port, ()=> {
    console.log(`Inventory Server is running on port ${port}`);
})