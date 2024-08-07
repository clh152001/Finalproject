const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,3));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', function(req, res) {
    const author = req.params.author;

    for (const bookId in books) {
      if (books[bookId].author === author) {
        const {title, reviews } = books[bookId];
        res.json({ 'isbn': bookId, title, reviews });
      }
    }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const title = req.params.title;
  
      for (const bookId in books) {
        if (books[bookId].title === title) {
          const {title, reviews  } = books[bookId];
        res.json({ 'isbn': bookId, title, reviews });
        }
      }
  });


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;


// Get the list of books using Promise callbacks
public_users.get('/books', (req, res) => {
    axios.get('/api/books')
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'An error occurred while fetching books.' });
      });
  });
  
  // Get the list of books using async/await
  public_users.get('/books-async', async (req, res) => {
    try {
      const response = await axios.get('/api/books');
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'An error occurred while fetching books.' });
    }
  });