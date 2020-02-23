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


//Create a car
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


//Get a vehicle
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


//Get All
app.get('/api/read',(req, res)=>{
    (async ()=>{

        try{
            
           let query = db.collection('Cars');
           let response = [];

           await query.get().then(querySnapshot => {
               let docs = querySnapshot.docs;

               for (let doc of docs){
                   const selectedItem = {
                       Brand: doc.data().Brand,
                       Model: doc.data().Model
                   };
                   response.push(selectedItem);
               }
               return response;
               
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
app.put('/api/update/:id',(req, res)=>{
    (async ()=>{

        try{
        const document = db.collection('Cars').doc(req.params.id);
            
        await document.update({
            Brand:req.body.Brand,
            Model:req.body.Model,
            BodyStyle:req.body.BodyStyle,
            Horsepower:req.body.Horsepower,
            Torque:req.body.Torque,
            TopSpeed:req.body.TopSpeed,
            Price:req.body.Price
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
        const document = db.collection('Cars').doc(req.params.id);
        await document.delete();
       
        return res.status(200).send();
        }
        catch(error){
            console.log(error);
            return res.status(500).send(error);
        }
        
    })();
});

//Create a Motorbike
app.post('/api/create',(req, res)=>{
    (async ()=>{

        try{
        await db.collection('MotorBikes').doc('/' + req.body.id + '/' )
        .create({
            Brand:req.body.Brand,
            Model:req.body.Model,
            Class:req.body.Class,
            Year:req.body.Year,
            CompressionRatio:req.body.CompressionRatio,
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


//Export the api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);