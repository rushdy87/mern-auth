import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const PORT = 3030;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('connecting to the MongoDB');
  })
  .catch((error) => {
    console.log(error);
  });

const app = express();

app.listen(PORT, () => {
  console.log(`Server is listening on port: (${PORT})..`);
});
