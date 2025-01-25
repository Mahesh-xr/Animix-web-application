import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;
const baseURL = 'https://api.jikan.moe/v4/'

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}));

app.get('/',  async(req, res)=>{
    try{
        const result = await axios.get(baseURL + 'top/anime',{
            params : {
                filter:'bypopularity',
            }
        });
        res.render('home.ejs', {animeList:result.data.data});

    }
    catch(error){
        console.error("Error:"+ error);
    }
})

app.get('/search', async (req, res) => {
   
  
    try {
        console.log(req.query.query)
      const response = await axios.get('https://api.jikan.moe/v4/anime', {
        params: {
          q: req.query.query,
        },
      });
  
      res.render('search_results.ejs',{results:response.data.data})
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch anime information' });
    }
  });
  
  app.get('/view/:mal_id', async (req, res) => {
    const mal_id = req.params.mal_id; // Extract mal_id from the URL
    const API_URL = `https://api.jikan.moe/v4/anime/${mal_id}`; // Jikan API endpoint for fetching specific anime
    const CHARACTER_API_URL = `https://api.jikan.moe/v4/anime/${mal_id}/characters`
    
    try {
        // Make a request to the Jikan API
        const response = await axios.get(API_URL);
        const animeData = response.data.data; // Get the anime data
        const char_res  = await axios.get(CHARACTER_API_URL);
        const characterData = char_res.data.data;
        console.log(characterData)
        
        // Render the anime detail page with the fetched data
        res.render('view.ejs', {
          anime: animeData,
          characters: characterData
        })
    } catch (error) {
      console.log(error)
        res.status(500).send('Error fetching anime details');
    }
});


app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
});