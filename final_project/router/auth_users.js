const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required" });
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid username or password" });
  }

  const accessToken = jwt.sign({ username: user.username }, "fingerprint_customer", { expiresIn: "1h" });

  req.session.token = accessToken;

  return res.status(200).json({
    success: true,
    message: "Login successful",
    token: accessToken
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  console.log("User in Request:", req.user);

  if (!req.user) {
    return res.status(401).json({ success: false, message: "You need to be logged in to post a review." });
  }

  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({ success: true, message: "Review added/updated successfully", review: review });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  console.log("User in Request:", req.user);

  if (!req.user) {
    return res.status(401).json({ success: false, message: "You need to be logged in to delete a review." });
  }

  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ success: false, message: "No review found for this user on this book." });
  }

  // Delete the user's review
  delete books[isbn].reviews[username];
  console.log(`Review deleted for ISBN ${isbn} by ${username}`);

  return res.status(200).json({
    success: true,
    message: "Review deleted successfully"
  });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
