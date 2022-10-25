const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 5500;
const { getTimetable } = require('./index.js');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`API Launched on: http://localhost:${PORT}`)
})

app.get('/:promo/:group/:date', async (req, res) => {
    const imageName = await getTimetable(req.params.promo, req.params.group, req.params.date);
    return (res.sendFile('generated/' + imageName + '.png', { root: './' }))
})