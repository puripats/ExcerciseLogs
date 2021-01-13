const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const moment = require('moment')

require('dotenv').config()


app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb')
const uri = "mongodb+srv://chonoi:Poopoo09@cluster0.be09s.mongodb.net/Exerciselogs?retryWrites=true&w=majority";

MongoClient.connect(uri, { useNewUrlParser: true })
.then(client=>{
  console.log('Connected to Database')
  const db = client.db('exerciselogs')
  const logsCollection = db.collection('logs')
  app.post('/api/exercise/new-user', (req, res) => {

    logsCollection.findOne({username:req.body.username},{})
    .then(result=>{
      if (result){
        console.log(result)
        res.redirect('/')
      } else{
        logsCollection.insertOne({username:req.body.username})
        .then(result => {
          console.log(result)
          res.json(result)
          res.redirect('/')
        })

      }
    }).catch(error => console.error(error))
   
})

/*
app.post('/api/exercise/add', (req, res) => {
  /*
  logsCollection.findOne(ObjectId(req.body.userId),{})
  .then(result=>{
    if(result){
      /*
      logsCollection.insertOne({
        _id:result._id,
        username:result.username,
        date:req.body.date,
        duration:req.body.duration,
        description:req.body.description,
        })
      res.redirect('/')
      
     
    }else{
      res.redirect('/')
    }
  })ObjectId("522754ca81ead2836185e34b")
})
*/
/*
app.post('/api/exercise/add', (req, res) => {
  const log={
    date:req.body.date,
    description:req.body.description,
    duration:req.body.duration
  }
logsCollection.findOneAndUpdate(
{
  '_id':ObjectId(req.body._id)
}, 
{
 // $set:{_id:req.body.id},
  $push: {username:req.body.username,date:req.body.date}
},{
  new: true,upsert: true,multi:true
},function(err,doc) {
       if (err) { throw err; }
       else { 
        console.log(doc.username);
         res.redirect('/')
        }
    })

})
*/
/*
app.post('/api/exercise/add', (req, res) => {
  logsCollection.findOne({_id:ObjectId(req.body.userId)},{})
  .then(result=>{
    if (result){
      logsCollection.insertOne({
        username:result.username,
        date:req.body.date,
        description:req.body.description,
        duration:req.body.duration})
      .then(result => {
        console.log(result)
        res.redirect('/')
      })
      
    } else{
        res.redirect('/')
     console.log('test')

    }
  }).catch(error => console.error(error))
})
*/
app.post('/api/exercise/add', (req, res) => {
  let exerciseDate = req.body.date ? req.body.date : '' + new Date().toISOString().slice(0,10)
  logsCollection.updateOne({_id:ObjectId(req.body.userId)},
  {
    $push:{date:exerciseDate,
      description:req.body.description,
      duration:req.body.duration}
  })
  
  logsCollection.findOne({_id:ObjectId(req.body.userId)},{})
  .then(result=>{
    const exerciseDate = moment(exercise.date).format('ddd MMM DD YYYY')
    if(result){
      res.json({
        _id: result._id,
        username: result.username,
        description: req.body.description,
        duration: req.body.duration,
        date: exerciseDate
      })
    }
  })
  
})

app.get('/api/exercise/log', (req, res) => {
  const userId = req.query.userId
  logsCollection.findOne({_id:ObjectId(userId)}, (err, user) => {
    if(err) {
      res.send(err)
      return
    }

    let queryObject;
    
    if (req.query.from && req.query.to){ 
      queryObject = {
        userId: userId,
        date: { $gte: req.query.from, $lte: req.query.to }
      }
      console.log(queryObject)
    } else {
      queryObject = {
        userId: userId        
      }
    }
    console.log(queryObject)
    

    logsCollection.find(queryObject, (err, exercises) => {
      console.log(exercise)
      if(err) res.send(err)

      let log = []
      let count = 0
      const limit = req.query.limit
      /*
      for(let exercise of exercises){
        if(limit && count >= limit) continue
        const exerciseDate = moment(exercise.date).format('ddd MMM DD YYYY')
        log.push({
          description: exercise.description,
          duration: exercise.duration,
          date: exerciseDate
        })
        count++
      }
      */
      res.json({
        _id: user._id,
        username: user.username,
        log: log,
        count: log.length
      })
    })
    
  })
})





})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
