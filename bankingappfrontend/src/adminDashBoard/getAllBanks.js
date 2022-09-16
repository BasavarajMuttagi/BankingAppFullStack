import axios from "axios"
import React, { useEffect, useState } from "react"
import NavBarAdmin from "./navBarAdmin"
import { Link } from 'react-router-dom';
function GetAllBanks() {

const [ObjArr,setObjArr] = useState({})
const [responseLength,setResponseLength] = useState(0)
const [errorObj,setErrorObj] = useState({})
const [errorToggle,setErrorToggle] = useState(false)




const handleGetAllBanks =()=>{
  
    axios.get("http://localhost:8080/api/getallbanks",{})
    .then((resp)=>{
        setObjArr(resp.data)
        console.log(resp.data);
        if(Object.keys(resp.data).length >0){
            setResponseLength(Object.keys(resp.data).length)
        }
        
    })
    .catch((err)=>{
        setErrorObj(err)
        setErrorToggle(true)
        console.log(err.response);
    })
}




useEffect(()=>{
handleGetAllBanks()
},[])

let allbanks = Object.values(ObjArr).map((eachElement)=>{
    return(
        <React.Fragment key={eachElement.bankID}>
        <tbody>
            <tr>
              <td key={eachElement.bankID}>{eachElement.bankID}</td>
              <td key={eachElement.bankName}>{eachElement.bankName}</td>
              <td key={eachElement.bankAbbreviation}>{eachElement.bankAbbreviation}</td>
            </tr>
        </tbody>
        
        </React.Fragment>
  )
})
const loggedInUser = localStorage.getItem("user");
if(loggedInUser !== 'admin')
{
  return ( 
    
    <div className="nav-item active">
      Please Login As Admin  <Link className="nav-link bg-primary badge" to="/" >Here<span className="visually-hidden">(current)</span></Link>
    </div>
      
    );
}
return(
<>
<NavBarAdmin/>
<table class="table">
                <thead>
                  <tr>
                
                    <th scope="col">Bank ID</th>
                    <th scope="col">Bank Name</th>
                    <th scope="col">Bank Abbriviation</th>
             
                  </tr>
                </thead>
                {allbanks}
            </table>
</>
)

}

export default GetAllBanks;