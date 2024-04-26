import express from 'express';
import bodyParser from 'body-parser' ;
import mongoose from 'mongoose';
import cors from "cors";

const app = express();
app.use(cors())

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://ramu:iMPAZiyvM83JBi65@cluster0.i6txbgk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a schema
const Schema = mongoose.Schema;
const BookSchema = new Schema({
    bookId: Number, 
    title: String, 
    description: String,
    cover: String, 
    price: Number
});
const book = mongoose.model('book', BookSchema);

// Routes
// Create an item
// Create an item
// Create an item
// Create an item
app.post('/books', (req, res) => {
    const newBook = new book(req.body); // Changed Item to book
    newBook.save()
        .then(book => {
            res.status(201).json(book);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

app.get('/books', async (req, res) => {
    try {
        const books = await book.find({}); // Changed Item to book
        res.json(books);
    } catch (err) {
        res.status(500).send(err);
    }
});


// Get single item by ID
app.get('/books/:bookId', async (req, res) => {
    try {
        const bookId = req.params.bookId;
        // Fetch the book from the database based on the provided ID
        const foundBook = await book.findOne({ bookId: bookId }); // Changed book to book.findOne
        // If the book is not found, return a 404 status code with an error message
        if (!foundBook) {
            return res.status(404).send('Book not found');
        }
        // If the book is found, send it as a JSON response
        res.json(foundBook);
    } catch (err) {
        // If an error occurs during the process, log the error and send a 500 status code with an error message
        console.error('Error:', err.message);
        res.status(500).send('Internal Server Error');
    }
});


// Update an item

app.put('/books/:bookId', async (req, res) => {
    try {
        const bookId = req.params.bookId;
        
        // Fetch the book from the database based on the provided ID
        const foundBook = await book.findOne({ bookId: bookId }); 

        // If the book is not found, return a 404 status code with an error message
        if (!foundBook) {
            return res.status(404).send('Book not found');
        }

        // Update the book with the provided data
        const updatedBook = await book.findOneAndUpdate(
            { bookId: bookId }, // Query condition
            req.body, // New data
            { new: true } // To return the updated document
        );

        // Check if the book was updated successfully
        if (!updatedBook) {
            return res.status(404).send('Book not found');
        }

        // Send the updated book as JSON response
        res.json(updatedBook);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

// Delete an item
app.delete('/books/:bookId', async (req, res) => {
    try {
        const bookId = req.params.bookId;
        
        // Fetch the book from the database based on the provided ID
        const foundBook = await book.findOne({ bookId: bookId }); 

        // If the book is not found, return a 404 status code with an error message
        if (!foundBook) {
            return res.status(404).send('Book not found');
        }

        const deletedBook = await book.findOneAndDelete({ bookId: req.params.bookId });
        if (!deletedBook) {
            return res.status(404).send('Book not found');
        }
        res.json("Book deleted successfully");
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));