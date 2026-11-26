const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 10: Get the book list available in the shop using async/await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        resolve(books);
      });
    };
    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 11: Get book details based on ISBN using Promises/async-await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("Book not found");
        }
      });
    };
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 12: Get book details based on author using async/await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        let matchingBooks = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
          if (books[isbn].author === author) {
            matchingBooks.push({
              "isbn": isbn,
              "title": books[isbn].title,
              "reviews": books[isbn].reviews
            });
          }
        });
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject("No books found by this author");
        }
      });
    };
    const results = await getBooksByAuthor(author);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 13: Get all books based on title using async/await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        let matchingBooks = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
          if (books[isbn].title === title) {
            matchingBooks.push({
              "isbn": isbn,
              "author": books[isbn].author,
              "reviews": books[isbn].reviews
            });
          }
        });
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject("No books found with this title");
        }
      });
    };
    const results = await getBooksByTitle(title);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
