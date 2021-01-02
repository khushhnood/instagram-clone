
import React,{createContext,useReducer,useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import Navbar from './components/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './components/Signup'
import Profile from './components/Profile'
import Home from './components/Home'

import CreatePostGit from './components/CreatePostGit'
import UserProfile from './components/UserProfile'
import EditProfile from './components/EditProfile'
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import Login from './components/Login';
import {reducer,initialState} from './reducer/userReducer'

export const UserContext = createContext();


const Routing = ()=>{
 
  const history = useHistory();

  useEffect(()=>{
     const user = localStorage.getItem("user");
     
     if(user){
       history.push('/')
     }else{
       history.push('/login')
     }
  },[])

  return (
    <Switch>
    <Route exact path="/">
    <Navbar/>
    <Home/>
    </Route>
    <Route path="/signup">
    <Signup />
    </Route>
    <Route path="/login">
    <Login />
    </Route>
    <Route exact path="/profile">
    <Navbar/>
    <Profile />
    </Route>
    <Route path="/create">
    <Navbar/>
    <CreatePostGit />
    </Route>
    <Route path="/profile/:userid">
    <Navbar/>
    <UserProfile />
    </Route>
    <Route path="/edit">
    <Navbar/>
    <EditProfile />
    </Route>
    </Switch>
  )
}


function App() {


  const [state,dispatch] = useReducer(reducer,initialState);

  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
     
     <Routing/>
     
    </BrowserRouter>
    </UserContext.Provider>
       
  );
}

export default App;
