const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;
const { getTimetable } = require('./index.js');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = app.listen(PORT || 3000, function () {
    let host = server.address().address
    let port = server.address().port
    console.log('App listening at http://%s:%s', host, port)
});

app.get('/:promo/:group/:date', async (req, res) => {
    const imageName = await getTimetable(req.params.promo, req.params.group, req.params.date);
    return (res.sendFile('generated/' + imageName + '.png', { root: './' }))
})