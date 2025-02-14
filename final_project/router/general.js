const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  // console.log(req.body.username)
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
  }

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Username already exists'
    });
  }

  users.push({ username, password });
  return res.status(201).json({
    success: true,
    message: 'User registered successfully'
  });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        if (books) {
          resolve(books);
        } else {
          reject("Books not found");
        }
      });
    };

    const bookList = await getBooks();

    return res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: bookList
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve books"
    });
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  const getBookByISBN = () => {
    return new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(`No book found with ISBN "${isbn}"`);
      }
    });
  };

  getBookByISBN()
    .then((book) => {
      return res.status(200).json({
        success: true,
        message: `Book with ISBN "${isbn}" retrieved successfully`,
        data: book,
      });
    })
    .catch((error) => {
      return res.status(404).json({
        success: false,
        message: error,
      });
    });
});


// Get book details based on author
// Get all books based on author
public_users.get('/author/:author', (req, res) => {
  const author = decodeURIComponent(req.params.author).toLowerCase().trim();

  const getBooksByAuthor = () => {
    return new Promise((resolve, reject) => {
      const matchingBooks = Object.values(books).filter(
        (book) => book.author.toLowerCase().trim() === author
      );
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject(`No books found for author "${author}"`);
      }
    });
  };

  getBooksByAuthor()
    .then((matchingBooks) => {
      return res.status(200).json({
        success: true,
        message: `Books authored by "${author}" retrieved successfully`,
        data: matchingBooks,
      });
    })
    .catch((error) => {
      return res.status(404).json({
        success: false,
        message: error,
      });
    });
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = decodeURIComponent(req.params.title).toLowerCase().trim();

  const getBooksByTitle = () => {
    return new Promise((resolve, reject) => {
      const matchingBooks = Object.values(books).filter(
        (book) => book.title.toLowerCase().trim() === title
      );
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject(`No book found with title "${title}"`);
      }
    });
  };

  getBooksByTitle()
    .then((matchingBooks) => {
      return res.status(200).json({
        success: true,
        message: `Books with title "${title}" retrieved successfully`,
        data: matchingBooks,
      });
    })
    .catch((error) => {
      return res.status(404).json({
        success: false,
        message: error,
      });
    });
});



//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const book = books[isbn]
  console.log(book)

  if (book) {
    return res.status(200).json({
      success: true,
      message: `Book isbn: "${isbn}" , name: "${book.title}" retrieved successfully`,
      review: book.reviews
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "Error",
    });
  }
});

module.exports.general = public_users;
