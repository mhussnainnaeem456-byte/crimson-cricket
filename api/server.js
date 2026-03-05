const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/api/score', async (req, res) => {
    try {
        const response = await axios.get('https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live', {
            headers: {
                'x-rapidapi-key': '3526b077efmshcd1c0e5fdaa82f3p1c51ebjsnf',
                'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
            }
        });
        
        const matches = response.data.typeMatches.flatMap(type => 
            type.seriesMatches?.flatMap(series => 
                series.seriesAdWrapper?.matches?.map(m => ({
                    title: `${m.matchInfo.team1.teamName} vs ${m.matchInfo.team2.teamName}`,
                    score: m.matchScore?.team1Score?.inngs1?.runs ? 
                           `${m.matchScore.team1Score.inngs1.runs}/${m.matchScore.team1Score.inngs1.wickets}` : 
                           "Live Soon"
                }))
            )
        ).filter(Boolean);

        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: "API Problem" });
    }
});

module.exports = app;
