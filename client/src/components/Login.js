import React,{useState,useContext} from 'react'
import {UserContext} from '../App'
import './Signup.css';
import logo from '../assets/insta-logo.png';
import {Link,useHistory} from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';

import axios from 'axios'


function Login() {
    
    const history = useHistory();
    
    const {dispatch} = useContext(UserContext);
     const [email,setEmail] = useState("");
     const [password,setPassword] = useState("");
     

     

     const handleSubmit = async(e) =>{
         e.preventDefault();
         try {
             const logindata = await axios.post('/auth/login',{
                                               email:email,
                                               password:password
                                               });
             
                  if(logindata.data.error){
                      
                      const errortoast = ()=>{
                          toast.error(logindata.data.error)
                      }
                      errortoast();
                  }else{
                      localStorage.setItem("jwt",logindata.data.token);
                      localStorage.setItem("user",JSON.stringify(logindata.data.user));
                      dispatch({type:"USER",payload:logindata.data.user});
                      history.push({pathname:'/'});
                  }                             
         } catch (error) {
             console.log(error);
         }
     }

    














    return (
        <div className="container-fluid mt-5">
            
            
           
                                 
        <div className="d-flex align-items-center justify-content-center mx-3">
            <div className="signin bg-white p-3" style={{border:"1px solid grey"}}>
                 <div className="d-flex flex-column ">
                     <div className="image-conatiner w-100 d-flex align-items-center justify-content-center">
                         <img src={logo} alt="logo" className="img-fluid"/>
                     </div>
                     <div className="heading mx-1">
                         <h6 className="text-muted">Login to see Photos and videos from your friends.</h6>
                     </div>
                     <div className="form mx-2">
                         <form onSubmit={(e)=>handleSubmit(e)} >
                             
                             <div className="form-group mx-2">
                                 <input onChange={e=>setEmail(e.target.value)} value={email} className="form-control" type="email" placeholder="Enter Email " required />
                             </div>
                             <div className="form-group mx-2">
                                 <input onChange={e=>setPassword(e.target.value)} value={password} className="form-control" type="password" placeholder="Enter password" required/>
                             </div>
                             <button type="submit" onSubmit={(e)=>handleSubmit(e)} className="btn btn-outline-primary d-block w-100">Login</button>
                         </form>
                     </div>
                     <div className="h-2 mx-3">
                         <span>Don't have an account? </span><Link to="/signup" >Sign up</Link>
                     </div>
                     <Toaster position="top-right" />
                 </div>
            </div>
        </div>
    </div>
    )
}

export default Login
