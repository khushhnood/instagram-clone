import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../App'
import profilePic from '../assets/profile.png';
import './Profile.css';
import axios from 'axios'
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import toast, { Toaster } from 'react-hot-toast';
import {Link} from 'react-router-dom'



function Profile() {

    const {state} = useContext(UserContext);
    
    const [pics,setPics] = useState([]);
    const [err,setErr] = useState('');
    const [postlength,setPostlength] = useState(0);
    const [profile,setProfile] = useState('');
   

    useEffect(()=>{
        const fetchdata = async()=>{
                 const picdata = await axios.get('/post/my',{
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("jwt")
                     }
                   });
                 
                  
                     
                     if(picdata.data.error){
                         setErr(picdata.data.error)
                         const errortoast = ()=>{
                             toast.error("Hey! go to new post page and create some.")
                         }
                         errortoast();
                     }else{
                        console.log("picdata") 
                        console.log(picdata);

                        setPics(picdata.data.mypost)
                        setPostlength(picdata.data.mypost.length)
                        setProfile(picdata.data.mypost[0].postedBy.profile)
                       
                     }
                 

        }

        fetchdata();
    },[])



    const newdata = async()=>{
        const picdata = await axios.get('/post/my',{
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
             }
           });
         
            
             
             if(picdata.data.error){
                 setPostlength(0)
                 setErr(picdata.data.error)
                 const errortoast = ()=>{
                     toast.error("Hey! go to new post page and create some.")
                 }
                 errortoast()
             }else{
                
                setPics(picdata.data.mypost)
                setPostlength(picdata.data.mypost.length)
                
               
             }
    }

    const notify = () => toast.success('post deleted!');


    const deletepost = async(postid,publicId)=>{
        const deleted = await axios.delete(`/post/delete/${postid}`,{
          headers: {
              Authorization: "Bearer " + localStorage.getItem("jwt")
           }
         });
         if(deleted){
             
             deletefromCloud(publicId);
              newdata();
              notify()
         }
         
        
  }

  const deletefromCloud = async(publicId)=>{
      try {
        const deletedfromcloud = await axios.post('/upload/delete',{
            publicId : publicId
        },{
          headers: {
              Authorization: "Bearer " + localStorage.getItem("jwt")
           }
         })
         if(deletedfromcloud){
             console.log("deelted from cloud");
         }
      } catch (error) {
          console.log(error);
      }
      
  }

    return (
        <div className="container" style={{maxWidth:"600px"}}>
            <div className=" my-5 d-flex flex-column justify-content-center align-items-center" style={{borderBottom:"1px solid black"}}>
                <div className=" my-3 d-flex justify-content-between align-items-center" style={{borderBottom:"1px solid black"}}>
                    <div className="d-flex m-2" style={{maxHeight:"100px",maxWidth:"100px",borderRadius:"50%"}}>
                        <img src={profile?profile:profilePic} alt="profilePic" className="img-fluid" style={{borderRadius:"50%"}}/>
                       </div>
                       
                    <div className="m-2">
                        <div className="display-4 d-flex">
                           <h2 className="profileName">{state?state.name:<span>profile</span>}</h2>
                           <button  className="btn btn-outline-primary  p-1 ml-5" style={{height:"80%"}} >
                               <Link to='/edit' ><span>Edit</span></Link>
                         
                         </button>
                        </div>
                        <div className="d-flex justify-content-around align-items-center">
                            <ul className="d-flex ">
                                <li className="profileList"><span>{postlength} posts</span></li>
                                <li className="profileList"><span>{state?state.followers.length:"0"} followers</span></li>
                                <li className="profileList"><span>{state?state.following.length:"0"} following</span></li>
                            </ul>
                           
                        </div>
                    </div>
                </div>
                

                <div className="gallery my-5 d-flex flex-wrap justify-content-around ">

                      {err? <h1>{err}</h1>: pics.map((item,index)=>(
                                           <div key={index} className="card m-2" style={{maxWidth:"30%"}}>
                                                  <div className="card-img-top">
                                                      <img src={item.photo} alt="user-photos"  className="img-fluid"/>
                                                  </div>
                                                  <div className="card-footer bg-white p-1">
                                                      <div className="d-flex align-items-center justify-content-center">
                                                      <FavoriteIcon style={{color:"red",margin:" 0px 4px",background:"white"}}/><span className="display-5" >{item.likes.length}</span>
                                                      <ChatBubbleOutlineIcon style={{color:"black",margin:"0px 4px",background:"white"}} /><span className="display-5" >{item.comments.length}</span>
                                                      <button onClick={()=>deletepost(item._id,item.publicId)} className="ml-auto" style={{border:"none",outline:"none",background:"white"}}><DeleteIcon /></button>
                                                      </div>

                                                  </div>
                                                  
                                           </div>

                     )) }
                     
                    


                </div>
                <Toaster position="bottom-center" />
            
            </div>
        </div>
    )
}

export default Profile
