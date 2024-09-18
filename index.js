// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const shortid = require('shortid');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/urlshortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define URL schema and model
const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
});

const Url = mongoose.model('Url', urlSchema);

// Endpoint to create a short URL
app.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    const shortUrl = shortid.generate();

    const newUrl = new Url({
        originalUrl,
        shortUrl: shortUrl,
    });

    await newUrl.save();
    res.json({ originalUrl, shortUrl });
});

// Endpoint to redirect to the original URL
app.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;
    const urlEntry = await Url.findOne({ shortUrl });

    if (urlEntry) {
        return res.redirect(urlEntry.originalUrl);
    } else {
        return res.status(404).send('URL not found');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
