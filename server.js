
var express = require("express");
var { MongoClient } = require("mongodb");
var path = require("path");

var app = express();

var client = new MongoClient("mongodb://127.0.0.1:27017/");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));



async function startServer() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        db = client.db("ReaditdDB");

        app.listen(8080, () => {
            console.log(`Server running....`);
        });
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
}

startServer();



// homepage but i dont have it yet so it just goes to login.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

// login page
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

// create account page
app.get("/create", (req, res) => {
    res.sendFile(path.join(__dirname, "create.html"));
});

// review page
app.get("/review", (req, res) => {
    res.sendFile(path.join(__dirname, "review.html"));
});

// admin manage page
app.get("/manage", (req, res) => {
    res.sendFile(path.join(__dirname, "manage.html"));
});



// i'm just condensing login and login_action here... i don't want too many files.
// this handles the login stuff
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        var user = await db.collection("Users").findOne({ username });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        if (user.password !== password) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        res.json({ message: "Login successful", user });
    } catch (err) {
        console.error(err);
    }
});


// again condensing create and create_action. i'm just handling it here
// and in create.html. this works fine but i'm not inserting new users' roles
// or ids
app.post("/api/create_account", async (req, res) => {
    const { username, password } = req.body;

    try {
        var existing = await db.collection("Users").findOne({ username });

        if (existing) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // still need to insert role and figure out user ids ?
        await db.collection("Users").insertOne({ username, password });

        res.json({ message: "Account created successfully!" });
    } catch (err) {
        console.error(err);
    }
});
