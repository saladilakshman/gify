import React,{useState,useEffect} from 'react';
import './App.css';
import {Typography,Stack, Button,Dialog,
  AppBar,TextField, ImageList, ImageListItem,
  useMediaQuery, Skeleton,Autocomplete,Card,
  CardContent,CardMedia,CardActions,IconButton,DialogContent,DialogActions,CircularProgress} from '@mui/material';
  import ShareIcon from '@mui/icons-material/Share';
  import DownloadIcon from '@mui/icons-material/Download';
  import API from "./key";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import axios from "axios";
import penguin from "./assets/penguin.png";
function App(){
 const[ishide,setIshide]=useState(false);
 const[close,setClose]=useState(false);
 const[data,setData]=useState([]);
 const[loading,setLoading]=useState(true);
 const[query,setQuery]=useState('telugu');
 const[arr,setArr]=useState([]);
 const[el,setEl]=useState('');
 const[meme,setMeme]=useState({
  memeTitle:'',
  memeSrc:''
 });
const[mediabreakpoints,setMediabreakpoints]=useState({
  columns:Number,
  heading:'',
  headingImage:'',
  fieldSize:'',
  buttonSize:''
})
const isMobile = useMediaQuery('(max-width:425px)');
 //calling multiple API calls using axios Promise with useEffect
 useEffect(()=>{
  Promise.all([getAllMemes(query),getSearchedMeme(el)])
  .then(response=>{
    setData(response[0].data.results)
    setLoading(false)
    setArr(response[1].data.results)
  })
  .catch(err=>console.log(err.message))
  isMobile?setMediabreakpoints({
    columns:2,
    heading:'body1',
    headingImage:'2rem',
    fieldSize:190,
    buttonSize:'small'
  }):setMediabreakpoints({
    columns:3,
    heading:'h4',
    headingImage:'3.5rem',
    fieldSize:300,
    buttonSize:'medium'
  })
 },[data,query,el])


 /**fetching the general memes */
 function getAllMemes(query){
  return axios.get(`https://tenor.googleapis.com/v2/search?q=${query}&key=${API}&client_key=my_test_app&limit=25`);
 }
 //fetching the meme based on input selection
 function getSearchedMeme(el){
  return axios.get(`https://tenor.googleapis.com/v2/autocomplete?key=${API}&client_key=my_test_app&q=${el}`)
 }

 /**Handling search value functionality */
 const gifsearching=()=>{
  const inputValue=document.getElementById("text-input");
  if(inputValue.value===""){
    setClose(true);
  }
  else{
    setQuery(el)
    setLoading(true)
  }
 }
 //Adding the css rules based on device breakpoints
 
  return (
    <>
    <AppBar position='static'color="primary">
      <Stack direction="row"spacing={0.5}p={0.5}justifyContent="center"alignItems="center">
      <img src={penguin}alt=""loading="lazy"style={{width:mediabreakpoints.headingImage}}/>
      <Typography variant={mediabreakpoints.heading}align="center">Gify Gifs</Typography>
      </Stack>
    </AppBar>
<Stack direction="row"spacing={2}  px={{xs:1}}justifyContent="center"alignItems="flex-end"sx={{
  marginBlockStart:3
}}>
  <Autocomplete disablePortal
   options={arr}
   renderInput={(params)=><TextField {...params}label="search"variant="standard"value={el}onChange={(e)=>setEl(e.target.value)}/>}
  sx={{width:mediabreakpoints.fieldSize}}id="text-input"/>
  <Button variant="contained"color="secondary"size={mediabreakpoints.buttonSize}onClick={gifsearching}>Search</Button>
</Stack>
  <Dialog open={close}>
    <DialogContent>
      <Typography variant={isMobile?"body1":"h6"}sx={{color:'grey',fontWeight:400}}>
      Please enter value to search
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button variant="text"onClick={()=>setClose(false)}>close</Button>
    </DialogActions>
  </Dialog>
  {loading?<Stack justifyContent='center'alignItems='center'>
  <CircularProgress sx={{marginBlockStart:25}}/>
  </Stack>:<Stack direction="row"justifyContent="center"alignItems='center'sx={{marginBlockStart:5}}>
<ImageList variant="masonry"cols={isMobile?2:3}gap={2} sx={{width:1000}}>
{data.map((item)=>{
  const{id,media_formats,content_description}=item;
  return <ImageListItem key={id}>
<img src={media_formats?.tinygif?.url}
alt=""
loading="lazy"
style={{borderRadius:'0.2rem'}}
onClick={(e)=>{
  setIshide(true)
  setMeme({
    memeTitle:content_description,
    memeSrc:e.target.src
  })
}}
/>
  </ImageListItem>
})}
</ImageList>
  </Stack>}
<Dialog open={ishide}>
<Card variant="elevation">
  <CardMedia 
  component="img"
image={meme.memeSrc}
alt=""
sx={{height:isMobile?"auto":350}}
  />
   <CardContent>
      <Typography variant="body1">{meme.memeTitle}</Typography>
    </CardContent>
  <CardActions sx={{display:'flex',justifyContent:'space-around',alignItems:'center'}}>
<IconButton variant="text"color="warning"onClick={async()=>{
await axios.get(meme.memeSrc,{responseType:'blob'})
.then(res=>{
const file=new File([res.data],`${meme.memeTitle}.gif`,{type:'image/gif'});
try{
if(navigator.canShare &&navigator.canShare(file)){
  navigator.share({
    files:[file]
  })
}
}
catch(err){
  console.log(err.message)
}
})
.catch(err=>console.log(err.message))
}}>
<ShareIcon/>
</IconButton>
<IconButton variant="text"color="info"onClick={async()=>{
await axios.get(meme.memeSrc,{responseType:'blob'})
.then(response=>{
  const url=URL.createObjectURL(response.data);
const anchor=document.createElement("a");
anchor.href=url;
anchor.download=`${meme.Title}.gif`;
document.body.appendChild(anchor)
anchor.click();
})
.catch(err=>console.log(err))
  }}>
  <DownloadIcon/>
</IconButton>
<Button variant="text"onClick={()=>setIshide(false)} sx={{flex:1}} size="small">Close</Button>
  </CardActions>
</Card>
</Dialog>
    </>
  );
}

export default App;
