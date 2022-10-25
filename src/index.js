const axios = require('axios');
const fs = require('fs');
const sharp = require('sharp');
const https = require('https');
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const login = async () => {
    const response = await axios.get('https://assas.podogest.com/agenda_XHR_appel_connexion/?login=agenda&password=assas&_=1666260337098', { httpsAgent });
    const cookie = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
    return (cookie);
}

const getUUID = async (cookie, promo, group, day) => {
    const url = `https://assas.podogest.com/Web_XHR_get_uuid/?classe=${promo}&groupe=${group}&jour=${day}&_=1666262846765`;
    const response = await axios.get(url, { 
        httpsAgent,
        headers: {
            "accept": "*/*",
            "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
            "sec-ch-ua": "\"Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "cookie": `4DSID=${cookie}`,
            "Referer": "https://assas.podogest.com/agenda.html",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        }
    })
    return (response.data);
}

const getImageId = async (cookie, uuid, promo, group, weekly, currentDate) => {
    const url = `https://assas.podogest.com/Web_XHR_get_agenda/?uuid=${uuid}&classe=${promo}&groupe=${group}&modehebdo=${weekly}&currentdate=${currentDate}&_=1666258827882`;
    const response = await axios.get(url, { 
        httpsAgent,
        headers: {
            "accept": "*/*",
            "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
            "sec-ch-ua": "\"Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "cookie": `4DSID=${cookie}`,
            "Referer": "https://assas.podogest.com/agenda.html",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        }
    })
    const image_id = response.data.split('\n')[8].split('"')[1].split('/')[2];
    return (image_id);
}

const getImage = async (cookie, img) => {
    const response = await axios.get(`https://assas.podogest.com/4DImg/${img}`, { 
        httpsAgent,
        responseType: 'arraybuffer',
        headers: {
            "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
            "sec-ch-ua": "\"Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "image",
            "sec-fetch-mode": "no-cors",
            "sec-fetch-site": "same-origin",
            "cookie": `4DSID=${cookie}`,
            "Referer": 'https://assas.podogest.com/agenda.html',
            "Referrer-Policy": "strict-origin-when-cross-origin"
          }
    });
    const image = Buffer.from(response.data, 'binary').toString('base64');
    return (image);
}

const resizeImage = async (buffer, promo, group, date) => {
    const name = promo + '_' + group + '_' + date;
    if (fs.existsSync('generated/' + name + '.png')) return (name);
    await sharp(buffer)
        .resize(1060, 666)
        .toFile('generated/' + name + '.png')
    return (name);
}

const getTimetable = async (promo, group, date) => {
    const cookie = await login();
    const uuid = await getUUID(cookie, '1', '0', '0');
    const image_id = await getImageId(cookie, uuid, promo, group, '1', date);
    const image = await getImage(cookie, image_id);
    const data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(data, 'base64');
    return (resizeImage(buffer, promo, group, date));
}

module.exports = { getTimetable };