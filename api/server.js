const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/score', async (req, res) => {
    try {
        const response = await axios.get('https://www.cricbuzz.com/');
        const $ = cheerio.load(response.data);
        const matches = [];

        $('.cb-mtch-lst').each((i, el) => {
            matches.push({
                title: $(el).find('.cb-lv-scr-mtch-hdr').text().trim(),
                score: $(el).find('.cb-lv-scrs-col').text().trim()
            });
        });

        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: "Data fetch failed" });
    }
});

module.exports = app;
