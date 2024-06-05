import Counter from '../models/counterModel.js'; 
import  Book  from '../models/bookModel.js';
import express from 'express';
const router = express.Router();

const getNextSequence = async (name) => {
    const counter = await Counter.findOneAndUpdate(
        { name: name },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
};

// Route to save a new book
router.post('/', async (req, res) => {
    try {
        if(!req.body.title || !req.body.author || !req.body.publishYear) return res.status(400).send({message : 'Send all required fields'}); 
        const id = await getNextSequence('bookId');  
        const newBook = {
            id : id ,
            title : req.body.title , 
            author : req.body.author , 
            publishYear : req.body.publishYear, 
        };
        const book = await Book.create(newBook);
        return res.status(201).send(book);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}); 

///Route for Get all books from database 
router.get('/', async (req, res) => {
    try {
        const books = await Book.find({});
        return res.status(200).json({
            count: books.length,
            data: books
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to get one book by its ID 
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});


//Route to UPDATE a book 
router.put('/:id', async (req, res) => {
    try {
        const { title, author, publishYear } = req.body;
        if (!title || !author || !publishYear) {
            return res.status(400).send({ message: 'Send all required fields: title, author, publishYear' });
        }

        const { id} = req.params;

        // Create an object with only the fields to update
        const updateFields = {
            title,
            author,
            publishYear
        };

        const updatedBook = await Book.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).send({ message: 'Book updated successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});


//Route to delete a book
router.delete('/:id' , async (req , res) => {
    try{
        const {id} = req.params ; 
        const result = await Book.findByIdAndDelete(id);
        if(!result) return res.status(404).json({message : 'id not found'});
    }catch(error){
        console.error(error.message);
        res.status(500).send({message : error.message});
    }
});

export default router ; 