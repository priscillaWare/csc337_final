var {MongoClient} = require('mongodb')
var express = require('express')

var client = new MongoClient('mongodb://127.0.0.1:27017/')

var app = express()

client.connect()
.then(() => {
    console.log("Connected to MongoDB")
    db = client.db("ReaditDB")
    app.listen(8080, () => console.log("Server running on port 3000"))
})
.catch(err => console.log(err))



// add a new user
function insertUser(obj){
    client.connect()
    .then(function(){
        var db = client.db('ReaditdDB')
        var coll = db.collection('Users')
        return coll.insertOne(obj)
    })
    .then(function(){
        console.log('added one new user')
    })
    .catch(function(err){
        console.log(err)
    })
    .finally(function(){
        client.close()
    })
}


// add a new book to the data base
function insertBook(obj){
    client.connect()
    .then(function(){
        var db = client.db('ReaditdDB')
        var coll = db.collection('Books')
        return coll.insertOne(obj)
    })
    .then(function(){
        console.log('inserted one .')
    })
    .catch(function(err){
        console.log(err)
    })
    .finally(function(){
        client.close()
    })
}


//add a new review
function insertReview(obj){
    client.connect()
    .then(function(){
        var db = client.db('ReaditdDB')
        var coll = db.collection('Review')
        return coll.insertOne(obj)
    })
    .then(function(){
        console.log('inserted one ...')
    })
    .catch(function(err){
        console.log(err)
    })
    .finally(function(){
        client.close()
    })
}

// TO DO:
// update a user's previously read list
// update a user's current read list
// update a user's future read list



// landing page
app.get('/', function(req, res){
    res.sendFile(__dirname + '/login.html')
})

// account home
app.get('/account', function(req, res){
    res.sendFile(__dirname + '/account.html')
})

// create an account
app.get('/create', function(req, res){
    res.sendFile(__dirname + '/create.html')
})

// create action
app.get('/createaction', function(req, res){
    res.sendFile(__dirname + '/create_action.html')
})

app.post('/createaction', async (req, res) => {
    try {
        const { username, password } = req.body
        await db.collection("Users").insertOne({ username, password })
        res.send("Account created!")
    } catch (err) {
        res.send("Error creating account.")
        console.log(err)
    }
})



// login page
app.get('/login', function(req, res){
    res.sendFile(__dirname + '/login.html')
})

// login action
app.get('/loginaction', function(req, res){
    res.sendFile(__dirname + '/login_action.html')
})


app.post('/loginaction', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await db.collection("Users").findOne({ username, password })
        
        if (user) {
            res.send("Login successful!")
        }
        else {
            res.send("Invalid credentials")
        }
    } catch (err) {
        console.log(err)
    }
})



// recommendation page
app.get('/recommendation', function(req, res){
    res.sendFile(__dirname + '/recommendation.html')
})

// users can leave a review
app.get('/review', function(req, res){
    res.sendFile(__dirname + '/review.html')
})

// admins can approve reviews and book requests
app.get('/manage', function(req, res){
    res.sendFile(__dirname + '/manage.html')
})




app.listen(8080, function(){
    console.log("server running...")
})