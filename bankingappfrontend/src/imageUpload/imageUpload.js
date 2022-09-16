
import React,{ useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

import PocketBase from 'pocketbase';



function ImageUpload() {

    const [imageData,setImageData] = useState()
    const [imagebase64,setimageBase64] = useState()
  
    const handleMyimageUpload = async(e) =>{
        e.preventDefault()
        const client = new PocketBase('http://127.0.0.1:8090');
        client.users.authViaEmail('netflix@gmail.com', 'Netflix@123');
        const data = imageData
        const record = await client.records.create('planImages', data);
        console.log(record);

    }



    
    return (
    <>
<form onSubmit={handleMyimageUpload}>
  <div className="form-group" >
    <input type="file" className="form-control-file" name='imageData' accept=".jpg, .jpeg, .png" onChange={e=>setImageData(e.target.files[0])} />        
    <div className="d-grid">
    <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit">Submit</button>
    </div>   
  </div>

</form>
    </>
);
}

export default ImageUpload;