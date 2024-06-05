import express from 'express';
import mongoose from 'mongoose';
import { PORT } from './config.js';
import connectDB from './DBconnect.js';
import Book from './models/bookModel.js';
import booksRoutes from './routes/bookRoutes.js';
import cors from 'cors';



const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

//Option1 : Allow all origins with default of cors(*)
// app.use(cors());

//Option2 : Allow custom origins 
app.use(cors({
        origin : "http://localhost:5173",
        methods : ['GET' , 'POST' , 'PUT' , 'DELETE'] ,
        allowedHeaders : ['Content-Type'],
    })
);

// Connect to the database
connectDB();

app.get('/', (req, res) => {
    console.log(req);
    return res.status(200).json('welcome to MERN STACK'); 
});

app.use('/books' , booksRoutes);





mongoose.connection.once('open', () => {
    console.log('connected to MONGO DB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// const { title, author, publishYear } = req.body;
//         const newBook = new Book({ title, author, publishYear });
//         await newBook.save();
//         res.status(201).json(newBook);import mongoose from 'mongoose';