const functions = require('firebase-functions');


const admin = require('firebase-admin');


//var admin = require("firebase-admin");

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://autoblogproject-6d263.firebaseio.com"
});

const express = require('express');

const app = express();

const db = admin.firestore();

const cors = require('cors');
app.use(cors({origin:true}));

//Create
//Post

app.post('/api/create',(req, res)=>{
    (async ()=>{

        try{
        await db.collection('Cars').doc('/' + req.body.id + '/' )
        .create({
            Brand:req.body.Brand,
            Model:req.body.Model,
            BodyStyle:req.body.BodyStyle,
            Horsepower:req.body.Horsepower,
            Torque:req.body.Torque,
            TopSpeed:req.body.TopSpeed,
            Price:req.body.Price
        })
        return res.status(200).send();
        }
        catch(error){
            console.log(error);
            return res.status(500).send(error);
        }
        
    })();
});


//Read a specific product based on id
//Get

app.get('/api/read/:id',(req, res)=>{
    (async ()=>{

        try{
            
            const document = db.collection('Cars').doc(req.params.id);
            let product = await document.get();
            let response = product.data();

        return res.status(200).send(response);
        }
        catch(error){
            console.log(error);
            return res.status(500).send(error);
        }
        
    })();
});


//Read all products
//Get

app.get('/api/read',(req, res)=>{
    (async ()=>{

        try{
            
           let query = db.collection('Cars');
           let response = [];

           await query.get().then(querySnapshot => {
               let docs = querySnapshot.docs; // the result of the query

               for (let doc of docs){
                   const selectedItem = {
                       id: doc.id,
                       name: doc.data().name,
                       description: doc.data().description,
                       price: doc.data().price
                   };
                   response.push(selectedItem);
               }
               return response; // each then should return a value
               
           })
           return res.status(200).send(response);
        }
        catch(error){
            console.log(error);
            return res.status(500).send(error);
        }
        
    })();
});

//Update
//Put
app.put('/api/update/:id',(req, res)=>{
    (async ()=>{

        try{
        const document = db.collection('products').doc(req.params.id);
            
        await document.update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        });

        return res.status(200).send();
        }
        catch(error){
            console.log(error);
            return res.status(500).send(error);
        }
        
    })();
});

//Delete
app.delete('/api/delete/:id',(req, res)=>{
    (async ()=>{

        try{
        const document = db.collection('products').doc(req.params.id);
        await document.delete();
       
        return res.status(200).send();
        }
        catch(error){
            console.log(error);
            return res.status(500).send(error);
        }
        
    })();
});

//Export the api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);