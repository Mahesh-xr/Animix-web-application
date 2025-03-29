import express from 'express';
import axios from 'axios';
import pg from "pg";


const app = express();
const PORT = process.env.PORT || 3000;
const baseURL = 'https://api.jikan.moe/v4/'
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}));



const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "animix",
  password: "mah@2005",
  port: 5432,
});
db.connect();

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

app.get('/addToFav/:mal_id', async (req, res) => {
  const mal_id = req.params.mal_id; // Extract mal_id from the URL
  // console.log("Anime mal_id : "+mal_id)
  const API_URL = `https://api.jikan.moe/v4/anime/${mal_id}`; // Jikan API endpoint for fetching specific anime
  const CHARACTER_API_URL = `https://api.jikan.moe/v4/anime/${mal_id}/characters`
  
  try {
      // Make a request to the Jikan API
      const response = await axios.get(API_URL);
      const animeData = response.data.data; // Get the anime data
      
      
      // Render the anime detail page with the fetched data
      res.render('addToFav.ejs', {
        anime: animeData,
      })
  } catch (error) {
    console.log(error)
      res.status(500).send('Error fetching anime details');
  }
});

app.post("/addToFav", async (req, res) => {
  const { score, reason, favCharacter, recommend, animeId,image_src , title} = req.body;

  try {
    const result = await db.query(
      "INSERT INTO anime_reviews (mal_id, reason, score, recommendation, favCharacter, image_src, title) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [animeId, reason, score, recommend, favCharacter, image_src, title]
    );

    res.json({ message: "Data inserted successfully", data: result.rows[0] });

  } catch (error) {
    console.error("Error inserting data:", error.message);
    res.status(500).json({ error: "Failed to insert data" });
  }
});
app.get("/my-favourites", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM anime_reviews");
    //console.log(result.rows)
    res.render("my-fav.ejs",{ favAnime:result.rows});
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});




app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
});