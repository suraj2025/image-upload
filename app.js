// app.js
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Image = require('./models/Image');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Multer Setup for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  try {
    const images = await Image.find();
    res.render('index', { images });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error loading images');
  }
});

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const newImage = new Image({
      imageUrl: `/uploads/${req.file.filename}`,
      imageName: req.file.originalname,
    });
    await newImage.save();
    res.render('result', { image: newImage });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error uploading the image');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
