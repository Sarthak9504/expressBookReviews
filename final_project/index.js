const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log("Authorization Header:", authHeader);

    if (!authHeader) {
        return res.status(401).json({ success: false, message: "You need to be logged in to post a review." });
    }

    const token = authHeader.split(' ')[1];
    console.log("Extracted Token:", token);

    jwt.verify(token, "fingerprint_customer", (err, decoded) => {
        if (err) {
            console.log("Token Verification Error:", err);
            return res.status(403).json({ success: false, message: "Invalid token" });
        }
        console.log("Decoded Token:", decoded);
        req.user = decoded;
        next();
    });
});



const PORT = 5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
