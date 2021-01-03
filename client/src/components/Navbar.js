import React,{useContext} from 'react'
import {UserContext} from '../App'
import {useHistory} from 'react-router-dom'
import logo from '../assets/insta-logo.png'
import {Link} from 'react-router-dom'
import axios from 'axios'
import './Navbar.css';

import DehazeIcon from '@material-ui/icons/Dehaze';
import SearchIcon from '@material-ui/icons/Search';

function Navbar() {

     
     const history = useHistory();
     const {state,dispatch} = useContext(UserContext);
    
      
     const handleClick = async()=>{
       localStorage.clear();
       dispatch({type:"CLEAR"});
       const logout =  await axios.get('/auth/logout');
       if(logout){
        history.push('/login');
       }
       

     }





    return (
        <div className="container-fluid nav-container" >
        <nav className="navbar  navbar-expand-lg navbar-light bg-white nev" >
        
        <Link className="navbar-brand" to="/"><img className="img-fluid" src={logo} alt="logo"/></Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" style={{border:"none"}}>
       <DehazeIcon fontSize="large"/>
         </button>
        <div className="collapse navbar-collapse" id="navbarNav">
             <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                 <span className="sr-only">(current)</span>
                  </li>
                  

                  {state?[<li key="0" className="nav-item">
                         <Link className="navbar-brand" to="/allusers"><SearchIcon /></Link>
                         
                          </li>,<li key="1" className="nav-item">
                         <Link className="navbar-brand" to="/profile">{state?state.name:<h3>name</h3>}</Link>
                       
                       </li>,<li key="2" className="nav-item">
                       <Link className="navbar-brand" to="/create">New post</Link>
                     </li>,<li key="3" className="nav-item">
                     <button style={{outline:"none" , background:"white" , border:"none"}} className="navbar-brand" onClick={handleClick} >Logout</button>
                     </li>] :  
                       [<li key="4" className="nav-item">
                       <Link className="navbar-brand" to="/login">Login</Link>
                       </li>,<li key="5" className="nav-item">
                   <Link className="navbar-brand" to="/signup">Signup</Link>
                    </li>] }  
                </ul>
        </div>
        </nav>
        </div> 
    )
}

export default Navbar
