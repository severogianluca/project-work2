require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const notFound = require('./middlewares/notFound');
const handleError = require('./middlewares/handleError');
const mangaRouter = require('./router/mangaRouter');

const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: process.env.FE_APP
}));


app.use(express.static('public'));


app.use(express.json());


app.use('/manga', mangaRouter);


app.get('/', (req, res) => {
    res.send('Benvenuto nel backend del tuo E-commerce di Manga!');
});

app.use(notFound);
app.use(handleError);

app.listen(PORT, () => {
    console.log(`Server backend in ascolto sulla porta ${PORT}`);
    console.log(`Accessibile da: http://localhost:${PORT} (per sviluppo)`);
});