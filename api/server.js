const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/api/score', async (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live',
        headers: {
            // Aapki original key yahan laga di hai
            'x-rapidapi-key': '3526b077efmshcd1c0e5fdaa82f3p1c51ebjsnf8da9801343c',
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        
        // CREX style data extraction
        const matches = [];
        if (response.data && response.data.typeMatches) {
            response.data.typeMatches.forEach(type => {
                if (type.seriesMatches) {
                    type.seriesMatches.forEach(series => {
                        if (series.seriesAdWrapper && series.seriesAdWrapper.matches) {
                            series.seriesAdWrapper.matches.forEach(m => {
                                matches.push({
                                    title: `${m.matchInfo.team1.teamName} vs ${m.matchInfo.team2.teamName}`,
                                    score: m.matchScore?.team1Score?.inngs1?.runs 
                                           ? `${m.matchScore.team1Score.inngs1.runs}/${m.matchScore.team1Score.inngs1.wickets} (${m.matchScore.team1Score.inngs1.overs})` 
                                           : "Live Soon",
                                    status: m.matchInfo.status
                                });
                            });
                        }
                    });
                }
            });
        }

        res.json(matches);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "API Connection Failed" });
    }
});

module.exports = app;
