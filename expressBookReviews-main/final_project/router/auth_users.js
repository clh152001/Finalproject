const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  //Write your code here
  const isbn = req.params.isbn;

  let book = books[isbn];  
  if (book) {  
      let review = req.body.review;
      // Add similarly for firstName
      // Add similarly for lastName
      // Update DOB if provided in request body
      if (review) {
          book["reviews"] = review;
      }
      // Add similarly for firstName
      // Add similarly for lastName
      books[isbn] = book;  // Update friend details in 'friends' object
      res.send(`The review for the book with ISBN ${isbn} has been added/updated.`);
  } else {
      // Respond if friend with specified email is not found
      res.send("Unable to find friend!");
  }


});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Extract email parameter from request URL
    const isbn = req.params.isbn;
    if (isbn) {
        // Delete friend from 'friends' object based on provided email
        delete books[isbn];
    }
    
    // Send response confirming deletion of friend
    res.send(`Reviews for the ISBN ${isbn} posted by the user ${users.username} deleted.`);

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
