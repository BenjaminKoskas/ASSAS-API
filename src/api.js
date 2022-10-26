const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;
const { getTimetable } = require('./index.js');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = app.listen(process.env.PORT || 3000, function () {
    let host = server.address().address
    let port = server.address().port
    console.log('App listening at http://%s:%s', host, port)
});

app.get('/:promo/:group/:weekly/:date/:cropped', async (req, res) => {
    console.log(`[GET] Params: ${JSON.stringify(req.params)}`);
    const imageName = await getTimetable(
        req.params.promo,
        req.params.group,
        req.params.weekly,
        req.params.date,
        req.params.cropped
    );
    return (res.sendFile('generated/' + imageName + '.png', { root: './' }))
})