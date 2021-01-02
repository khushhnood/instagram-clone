import React,{useState} from 'react'
import {useHistory} from 'react-router-dom'
import './Signup.css';
import logo from '../assets/insta-logo.png';
import {Link} from 'react-router-dom'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';


function Signup() {

    const history = useHistory();
    const [name, setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    

   

   

   const  handleSubmit = async(e) =>{



            e.preventDefault();

            try {
             const postdata =   await  axios.post('/auth/signup',{
                                                      name: name,
                                                      email: email,
                                                      password : password
                                                  })
                            
                         if(postdata.data.error){
                          
                            const errortoast = ()=>{
                                toast.error(postdata.data.error)
                            }
                            errortoast();
                         }else{
                             
                             const successtaost = ()=>{
                                 toast.success("Account created!")
                             }
                             successtaost();
                             history.push({pathname:'/login',state:{errormsg:postdata.data.message}});
                         }                         


               
                
            } catch (error) {
                console.log(error)
            }

          // console.log(postData);
   }



    return (
        <div className="container-fluid mt-5">

            
             <Toaster position="top-right" />
                 

            <div className="d-flex align-items-center justify-content-center mx-3">
                <div className="signin bg-white p-3" style={{border:"1px solid grey"}}>
                     <div className="d-flex flex-column ">
                         <div className="image-conatiner w-100 d-flex align-items-center justify-content-center">
                             <img src={logo} alt="logo" className="img-fluid"/>
                         </div>
                         <div className="heading mx-1">
                             <h6 className="text-muted">Signup to see Photos and videos from your friends.</h6>
                         </div>
                         <div className="form mx-2">
                             <form  onSubmit={(e)=>handleSubmit(e)}>
                                 <div className="form-group mx-2">
                                     <input onChange={e=>setName(e.target.value)} value={name} className="form-control" type="text" placeholder="Enter Name" required/>
                                 </div>
                                 <div className="form-group mx-2">
                                     <input onChange={e=>setEmail(e.target.value)} value={email} className="form-control" type="email" placeholder="Enter Email " required />
                                 </div>
                                 <div className="form-group mx-2">
                                     <input  onChange={e=>setPassword(e.target.value)} value={password} className="form-control" type="password" placeholder="Enter password" required/>
                                 </div>
                                 <button type="submit" onSubmit={(e)=>handleSubmit(e)} className="btn btn-outline-primary d-block w-100">Create Account</button>
                             </form>
                         </div>
                         <div className="h-2 mx-3">
                             <span>Already have an account? </span><Link to="/login" >Login</Link>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
