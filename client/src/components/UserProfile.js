import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../App'
import axios from 'axios';
import {useParams} from 'react-router-dom'
import profilePic from '../assets/profile.png';
import './Profile.css';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'




function UserProfile() {
    const {state,dispatch}  = useContext(UserContext);
    const [data,setData] = useState(null);
    const [err,setErr] = useState('');
    const [follow,setFollow] = useState(true);
    const [followers,setFollowers] = useState(0);
    


    


    const {userid} = useParams();

    useEffect(()=>{
        
        const fetchdata = async()=>{
            const userdata = await axios.get(`/users/profile/${userid}`,{
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwt")
                 }
               }).catch(err=>{
                   console.log(err)
                   setErr(err);
               })

              
               if(userdata){
                   setData(userdata.data)
                   setFollow(userdata.data.user.followers.includes(state._id)?false:true)
                   setFollowers(userdata.data.user.followers.length)
                  
               }
              
        }
        
        fetchdata()

    },[])


    const followuser  = async(followid)=>{
        const followed = await axios.put('/users/follow',{
            followid : followid
        },{
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
             }
           })
        if(followed){
           
          dispatch({type:'UPDATE',payload:{followers:followed.data.followers,following:followed.data.following}});
          localStorage.setItem("user",followed.data)
          setFollowers(followers+1)
         
          
        }
    }

    const unfollowuser  = async(unfollowid)=>{
        const unfollowed = await axios.put('/users/unfollow',{
            unfollowid : unfollowid
        },{
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
             }
           })
        if(unfollowed){
          
          dispatch({type:'UPDATE',payload:{followers:unfollowed.data.followers,following:unfollowed.data.following}});
          localStorage.setItem("user",unfollowed.data)
          setFollowers(followers-1)
          
        }
    }




    return (
        <>
        {data ? <div className="container" style={{maxWidth:"600px"}}>
        <div className=" my-5 d-flex flex-column justify-content-center align-items-center" style={{borderBottom:"1px solid black"}}>
            <div className=" my-3 d-flex justify-content-between align-items-center" style={{borderBottom:"1px solid black"}}>
                <div className="profileContainer m-2">
                    <img src={data.user.profile?data.user.profile:profilePic} alt="profile-pic" className="round img-fluid"/>
                    
                </div>
                
                <div className="m-2">
                    <div className="display-4 d-flex ">
                       <h2 className="profileName"><span>{data.user.name}</span></h2>
                       <button  className="btn btn-primary  p-1 ml-5" style={{height:"80%"}}
                         onClick={async (e) => {
                            follow ? await followuser(data.user._id) : await unfollowuser(data.user._id);
                            setFollow(!follow);
                          }}
                         >{follow ? <span>Follow</span>:<span>Unfollow</span>}
                         
                         </button>
                    </div>
                    <div className="d-flex justify-content-around align-items-center">
                        <ul className="d-flex ">
                            <li className="profileList"><span>{data.posts.length} posts</span></li>
                            <li className="profileList"><span>{followers} followers</span></li>
                            <li className="profileList"><span>{data.user.following.length} following</span></li>
                        </ul>
                       
                    </div>
                    <div className="container-fluid d-flex align-items-center justify-content-center">
                  
                    </div>
                </div>
            </div>
            

            <div className="gallery my-5 d-flex flex-wrap justify-content-around ">

                  {err? <h1>{err}</h1>: data.posts.map((item,index)=>(
                                       <div key={index} className="card" style={{maxWidth:"30%"}}>
                                              <div className="card-img-top">
                                                  <img src={item.photo} alt="user-photos"  className="img-fluid"/>
                                              </div>
                                              <div className="card-footer bg-white p-1">
                                                      <div className="d-flex align-items-center justify-content-center">
                                                      <FavoriteIcon style={{color:"red",margin:" 0px 4px",background:"white"}}/><span className="display-5" >{item.likes.length}</span>
                                                      <ChatBubbleOutlineIcon style={{color:"black",margin:"0px 4px",background:"white"}} /><span className="display-5" >{item.comments.length}</span>
                                                      
                                                      </div>

                                                  </div>
                                                  
                                             
                                       </div>

                 )) }
                 
                


            </div>

        
        </div>
    </div> : <div className="container d-flex align-items-center justify-content-center " style={{height:"100px",width:"200px"}}>
    <Loader type="Rings" color="#00BFFF" height={100} width={100}  />
                 </div>}
        
    </>
    )
}

export default UserProfile
