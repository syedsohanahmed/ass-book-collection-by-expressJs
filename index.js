const path = require("node:path");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 3000;

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// database
let bookDatabase = [];

// route section
app.get("/", (req, res) => {
  res.status(200).sendFile("./index.html");
});

app.get("/books", (req, res) => {
  res.status(200).send(bookDatabase);
});

app.post("/books", (req, res) => {
  let { title, author, publishedDate } = req.body;
  if (publishedDate) {
    publishedDate = new Date(publishedDate).toISOString().slice(0, 10);
  }

  if (title && author) {
    const data = publishedDate
      ? {
          id: uuidv4(),
          title: title,
          author: author,
          publishedDate: publishedDate,
        }
      : {
          id: uuidv4(),
          title: title,
          author: author,
        };

    bookDatabase.push(data);
    res.status(201).json({
      message: "successfully created",
      book: {
        ...data,
      },
    });
  } else {
    return res.status(400).json({
      message: "invalid request . please submitted json data in body",
    });
  }
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  // Find the book with the specified ID
  const isExits = bookDatabase.find((book) => book.id === bookId);

  if (isExits) {
    const remaining = bookDatabase.filter((book) => book.id !== bookId);
    bookDatabase = remaining;
    res.status(200).json({
      message: "successfully delete",
      id: bookId,
    });
  } else {
    res.status(400).json({
      message: "invalid book id",
    });
  }
});

// not found route
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
