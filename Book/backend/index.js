import express from 'express';
import bodyParser from 'body-parser' ;
import mongoose from 'mongoose';

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://chami:<password>@chami.2t2tfpv.mongodb.net/test1?retryWrites=true&w=majority&appName=chami', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a schema
const Schema = mongoose.Schema;
const ItemSchema = new Schema({
    name: String,
    description: String
});
const Item = mongoose.model('Item', ItemSchema);

// Routes
// Create an item
app.post('/items', (req, res) => {
    const newItem = new Item(req.body);
    newItem.save((err, item) => {
        if (err) return res.status(500).send(err);
        res.status(201).json(item);
    });
});

// Get all items
app.get('/items', (req, res) => {
    Item.find({}, (err, items) => {
        if (err) return res.status(500).send(err);
        res.json(items);
    });
});

// Get single item by ID
app.get('/items/:id', (req, res) => {
    Item.findById(req.params.id, (err, item) => {
        if (err) return res.status(500).send(err);
        if (!item) return res.status(404).send('Item not found');
        res.json(item);
    });
});

// Update an item
app.put('/items/:id', (req, res) => {
    Item.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, item) => {
        if (err) return res.status(500).send(err);
        if (!item) return res.status(404).send('Item not found');
        res.json(item);
    });
});

// Delete an item
app.delete('/items/:id', (req, res) => {
    Item.findByIdAndRemove(req.params.id, (err, item) => {
        if (err) return res.status(500).send(err);
        if (!item) return res.status(404).send('Item not found');
        res.json(item);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));