import React,{useState} from 'react'
import toast, { Toaster } from 'react-hot-toast';

import axios from 'axios'


import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'



function EditProfile() {


    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState();
  
    
  
    const [loading,setLoading] = useState(false);
    

   



    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        previewFile(file);
        setSelectedFile(file);
        setFileInputState(e.target.value);
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    const handleSubmitFile = (e) => {
        e.preventDefault();
        setLoading(true);
        if (!selectedFile) return;
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = async() => {
            const uploaded = await uploadImage(reader.result);
           
            if(uploaded){
                const {imgurl,publicId} = uploaded;
                setLoading(false)
                savePost(imgurl,publicId);
                toast.dismiss();
                upsucess();
                

            }else{
                setLoading(false);
              
                const errortoast = ()=>{
                    toast.error("unable to upload")
                }
                errortoast()
            }
           
        };
        reader.onerror = () => {
            console.error('AHHHHHHHH!!');
            setLoading(false)
            const errortoast = ()=>{
                toast.error("something went wrong")
            }
            errortoast()
            
        };

        
         
        




    };

    
    const savePost = async(url,publicId) =>{
           try {
               const saved = await axios.put('/users/edit',{
                   profile : url,
                   profilePublicId : publicId
               },{
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwt")
                 }
               })
             
               if(saved.data.created){
                   
                   setLoading(false);
                   

               }else if(saved.data.error){
                  
                  
                  setLoading(false);
                  const errortoast = ()=>{
                    toast.error(saved.error) 
                      }
                   errortoast()
                  
               }
           } catch (error) {
               console.log(error);
               
           }
    }

    const uploadImage = async (base64EncodedImage) => {
        try {
            const uploadedImage =  await axios.post("/upload",{data: base64EncodedImage});
            
            if(uploadedImage.data.error){
                setLoading(false)
                
                const errortoast = ()=>{
                    toast.error(uploadedImage.data.error)
                }
                errortoast()

                return 
            }
           const imgurl = uploadedImage.data.urldata.url;
           const publicId = uploadedImage.data.urldata.public_id;
           
           
            

            //console.log("res :",res);
            //console.log(`url is ${res.data.urldata.url}`)
            //setUrl(res.data.urldata.url);
           
          
            setFileInputState('');
            setPreviewSource('');
           
            return ({imgurl:imgurl,publicId:publicId});

        } catch (err) {
            console.error(err);
            
        }
    };



    const notify = () => toast.loading('please wait! uploading your image');
    const upsucess = ()=> toast.success('profile added!');


    return (
        <div className="container my-5" style={{maxWidth:"600px"}}>
         
      
      

                <div className="card">
                     <div className="card-header">
                         {loading ? <div className="container   d-flex ">
                                  <span className="display-6">Uploading</span><span><Loader type="ThreeDots" color="#00BFFF" height={30} width={30}  /></span>
                                  
    
                         </div> : <small className="display-6">select jpeg , png , jpg files</small>}
                     </div>
                <div className="card-title">
                    
                {previewSource && (
                    <div className="d-flex flex-column my-1 align-items-center justify-content-center">
                        <p className="display-4">Preview</p>
                         <img
                    src={previewSource}
                    alt="chosen"
                    style={{ maxHeight: '300px',maxWidth:"300px" ,borderRadius:"50%"}}
                /></div>
               
                  )}
                </div>
                <div className="card-body">
                  <div className="card-text">
                  <form onSubmit={handleSubmitFile}>
                        
                   <div className="form-group">
                          <label >Select Image</label>
                               <input type="file" required  value={fileInputState} onChange={handleFileInputChange}  className="form-control" id="file" placeholder="Select jpg , jpeg , png only"/>
                          </div>
 
                    <button onClick={notify} type="submit" className="btn btn-primary">Post</button>
                    <Toaster position="bottom-center" />
                    
                   </form>
                  </div>

                </div>
            </div>
      
           
        </div>
    )
}

export default EditProfile
