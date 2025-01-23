import  express from 'express';
import  axios from 'axios'
const app = express();
const port = 3000;
const baseURL = ''
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));


app.get('/', async(req, res)=>{
    try{
     constresult = await axios.get(baseURL,{
        params = {
            
        }
     }

     )
    }
    catch(error){

    }
   res.render('home.ejs', {topAnime: })
})

app.listen(port, ()=>{
    console.log(`server running at port ${port}` )
})