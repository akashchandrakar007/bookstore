import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import BooksRoute from "./routes/booksRoutes.js";

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("Hello world!");
});

app.use("/books", BooksRoute);

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
