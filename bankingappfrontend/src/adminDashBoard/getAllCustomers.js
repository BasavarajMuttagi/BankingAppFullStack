import axios from "axios"
import React, { useEffect, useState } from "react"
import NavBarAdmin from "./navBarAdmin"
import { Link, useNavigate } from 'react-router-dom';

import SearchInput, {createFilter} from 'react-search-input'

function GetAllCustomers() {
const navigation = new useNavigate()
const KEYS_TO_FILTERS = ['firstName', 'lastName', 'credential.userName']
const [ObjArr,setObjArr] = useState({})
const [responseLength,setResponseLength] = useState(0)
const [banksArray,setBanksArray] = useState([])
const [searchTerm,setsearchTerm] = useState('')

const searchFilter = Object.values(ObjArr).filter(createFilter(searchTerm, KEYS_TO_FILTERS))




const handleGetAllBanks =()=>{
  
    axios.get("http://localhost:8080/api/getallcustomers",{})
    .then((resp)=>{
        setObjArr(resp.data)
        console.log(resp.data);
        if(Object.keys(resp.data).length >0){
            setResponseLength(Object.keys(resp.data).length)
        }
        
    })
    .catch((err)=>{

        console.log(err.response);
    })
}

const createAccount=(userName)=>{
  navigation('/createBankAccount',{state:{userName : userName}})
}

useEffect(()=>{
handleGetAllBanks()
},[searchTerm])

let myBanks=(banksArray)=> Object.values(banksArray).map((eachBank)=>{
    return(<option disabled key={eachBank}>{eachBank.bankAbbreviation}</option>)
})

let allCustomers = searchFilter.map((eachElement)=>{
    return(
        <React.Fragment key={eachElement.customerID}>
            
        <tbody>
            <tr>
              <td key={eachElement.customerID}>{eachElement.customerID}</td>
              <td key={eachElement.credential.userName}>{eachElement.credential.userName}</td>
              <td key={eachElement.firstName}>{eachElement.firstName}</td>
              <td key={eachElement.lastName}>{eachElement.lastName}</td>
              <td key={eachElement.role}>{eachElement.role}</td>
              <td key={eachElement.isActive}>{String(eachElement.isActive)}</td>
              <td key={eachElement.accounts}>
                {
                 <div className="mb-3"> 
                 <select className="form-select">
                 <option selected >Banks</option>
                   {myBanks(eachElement.accounts)}
                 </select>       
                </div>
                }
              </td>
              <td><button type="button" class="btn btn-primary" disabled={eachElement.accounts.length >0? true : false} onClick={()=>{createAccount(eachElement.credential.userName)}}>Create Account</button></td>
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
<div class=" col-md-3 m-2 float-end" >
   <label class="" >Search</label>
  <input type="search" id="form1" class="form-control border border-dark" placeholder="Type query" aria-label="Search" value={searchTerm} onChange={(e)=>{setsearchTerm(e.target.value)}} />
</div>
            <table className="table">
                <thead>
                  <tr>
                  <th scope="col">customerID</th>
                    <th scope="col">userName</th>
                    <th scope="col">firstName</th>
                    <th scope="col">lastName</th>
                    <th scope="col">Role</th>
                    <th scope="col">isActive</th>
                    <th scope="col">accounts</th>
                  </tr>
                </thead>
                {allCustomers}
            </table>
</>
)

}

export default GetAllCustomers;