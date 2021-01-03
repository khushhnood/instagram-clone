import React,{useEffect,useState} from 'react'
import {Link} from 'react-router-dom';
import axios from 'axios'

function AllUsers() {


    const [users,setUsers] = useState([]);

     useEffect(()=>{
       const fetchdata = async()=>{
         const fetched = await axios.get('/users/all',{
          headers: {
              Authorization: "Bearer " + localStorage.getItem("jwt")
           }
         })


         if(fetched.data.error){
             console.log(fetched.data.error)
         }else{
           
           setUsers(fetched.data.users)
         }

       }
       fetchdata();
     },[])



    return (
        <div className="row">
            <div className="container d-flex flex-column" style={{maxWidth:"600px"}}>
            {users.map((item,index)=>(
                <div key={index} className="container-fluid m-2 p-1" style={{borderBottom:"1px solid black"}}>
                  <Link to={`/profile/${item._id}`}><h5>{index+1}: {item.name}</h5></Link>

                </div>
              ))}
            </div>
        </div>
    )
}

export default AllUsers
