import express from 'express ';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5172;

const app = express();
app.use(express.json)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});