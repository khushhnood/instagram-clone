import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../App'
import Card from './Card';
import axios from 'axios'


function Home() {
    
   const [data,setData] = useState([]);

   const {state}  = useContext(UserContext);

   useEffect(()=>{
       if(state){
        const allpost = async()=>{
            const postdata =  await axios.get('/post/all',{
              headers: {
                  Authorization: "Bearer " + localStorage.getItem("jwt")
               }
             })
            
             console.log("postdata");
             console.log(postdata)
             setData(postdata.data.message)
            
             
             
         }
         allpost()
       }
       
   },[state])




    return (
        <div className="container-fluid">
            <div className="container d-flex flex-column justify-content-center align-items-center my-5" style={{maxWidth:"600px"}}>
               {state ? data.map((item,index)=>(

                     <Card stateId={state._id} timestamp={item.createdAt} comments={item.comments} likes={item.likes} profile={item.postedBy.profile} key={index} name={item.postedBy.name} photo={item.photo} caption={item.caption} id={item.postedBy._id} postId={item._id}
                         liked={item.likes.filter(like=>like === state._id).length >0 ? true : false} />
               )):<h1>Welcome ! 👋<br/> Please Login to continue..</h1>}
            </div>
        </div>
    )
}

export default Home
