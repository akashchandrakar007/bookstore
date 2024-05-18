import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";

const app = express();

app.use(express.json());

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("Hello world!");
});

// Route for save a new book
app.post("/books", async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response
        .status(400)
        .send({ message: "Send all the required fields" });
    }

    const newBook = {
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear,
    };

    const book = await Book.create(newBook);
    return response.status(201).send(book);
  } catch (error) {
    console.log({ error });
    return response.status(500).send({ error });
  }
});

//get all the books
app.get("/books", async (request, response) => {
  try {
    const books = await Book.find({});
    return response.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).json({ error });
  }
});

// get books by id
app.get("/books/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const book = await Book.findById(id);
    return response.status(200).json(book);
  } catch (error) {
    console.log({ error });
    return response.status(500).json({ error });
  }
});

//update book data with given id
app.put("/books/:id", async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response
        .status(400)
        .send({ message: "Send all the required fields" });
    }
    const { id } = request.params;
    const result = await Book.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).send({ message: "Book not found" });
    }

    return response.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    console.log({ error });
    return response.status(500).json({ error });
  }
});

//delete book by id
app.delete("/books/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Book.findByIdAndDelete(id);
    if (!result) {
      return response.status(404).send({ message: "Book not found" });
    }

    return response.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log({ error });
    return response.status(500).json({ error });
  }
});

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App is connected to database");
    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log({ err });
  });
