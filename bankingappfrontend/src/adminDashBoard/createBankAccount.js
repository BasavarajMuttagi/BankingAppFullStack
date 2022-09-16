import axios from 'axios';
import React,{ useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Link, useLocation } from 'react-router-dom';
import NavBarAdmin from './navBarAdmin';


function CreateBankAccount() {
    const location = useLocation();
    const [bankAbbreviation, updateBankAbbr] = useState("")
    const [loginStatus, updateloginStatus] = useState("")
    const [userName, updateUserName] = useState(location.state.userName)
    const [bankObj, updateBankObj] = useState([])
    const handleMyCreateBankAccount = (e) =>{
            e.preventDefault()

            console.log(bankAbbreviation);
            if(bankAbbreviation!=null){
             axios.post("http://localhost:8080/api/createbankaccount",{userName,bankAbbreviation}).then(resp=>{
              if(resp.status === 200){
                updateloginStatus(resp.data)
                console.log(resp);
            }
            }).catch(err=>{
              updateloginStatus(err.response.data)
              console.log(err);
            })
          }
    }


// let dropDown = Object.values(bankObj).map((eachBank)=>{return(<option value={eachBank.bankAbbreviation} key={eachBank.bankAbbreviation}>{eachBank.bankName}</option>)})
let dropDown = Object.values(bankObj).map((eachBank)=>{return(<option value={eachBank.bankAbbreviation} key={eachBank.bankAbbreviation}>{eachBank.bankName}</option>)})


    const handleMyDropDown = () =>{
       axios.get("http://localhost:8080/api/getallbanks",{}).then(resp=>{
        if(resp.status === 200){
          updateBankObj(resp.data)
          console.log(resp.data);
          
      }
      }).catch(err=>{
        // updateloginStatus(err.response.data)
        console.log(err);
      })
    }

    
useEffect(()=>{handleMyDropDown()},[])

const loggedInUser = localStorage.getItem("user");
if(loggedInUser !== 'admin')
{
  return ( 
    
    <div className="nav-item active">
      Please Login As User  <Link className="nav-link bg-primary badge" to="/" >Here<span className="visually-hidden">(current)</span></Link>
    </div>
      
    );
}






    return ( 
    <>
    <NavBarAdmin/>
    <div className="container">
    <div className="row">
      <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div className="card border-0 shadow rounded-3 my-5">
          <div className="card-body p-4 p-sm-5">
            <h5 className="card-title text-center mb-5 fw-light fs-5">Create Bank Account</h5>
            <form onSubmit={handleMyCreateBankAccount} >
           
               <div className="mb-3"> 
                      <label  className="form-label">Bank</label>
                      <select className="form-select"  value={bankAbbreviation} onChange={(e) => updateBankAbbr(e.target.value)}>
                     <option selected value={null} >Select A Bank</option>
                        {dropDown}
                      </select>       
                </div> 
      
              <div className="d-grid">
                <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit">Create Bank Account</button>
              </div>
              <h1-6 m-2>Message :<span className="badge bg-primary m-2">{loginStatus}</span></h1-6>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
    </> );
}

export default CreateBankAccount;