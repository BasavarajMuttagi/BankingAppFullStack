import axios from 'axios';
import React,{ useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import NavBarAdmin from './navBarAdmin';
import { Link } from 'react-router-dom';
function CreateBank() {
    const [bankName, updateBankName] = useState("")
    const [bankAbbreviation, updateBankAbbr] = useState("")
    const [loginStatus, updateloginStatus] = useState("")
    const handleMyCreateBank = (e) =>{
            e.preventDefault()
             axios.post("http://localhost:8080/api/createbank",{bankName,bankAbbreviation}).then(resp=>{
              if(resp.status === 200){
                updateloginStatus(resp.data)
                console.log(resp);
            }
            }).catch(err=>{
              updateloginStatus(err.response.data)
              console.log(err);
            })
    }
    
    const loggedInUser = localStorage.getItem("user");
    if(loggedInUser !== 'admin')
    {
      return ( 
        
        <div className="nav-item active">
          Please Login As Admin  <Link className="nav-link bg-primary badge" to="/" >Here<span className="visually-hidden">(current)</span></Link>
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
            <h5 className="card-title text-center mb-5 fw-light fs-5">Create Bank</h5>
            <form onSubmit={handleMyCreateBank} >
              <div className="form-floating mb-3">
                <input type="text" className="form-control" value={bankName} onChange={(e) => updateBankName(e.target.value)} id="floatingInput" placeholder="name@example.com" />
                <label >Bank Name</label>
              </div>
             <div className="form-floating mb-3">
                <input type="text" className="form-control" value={bankAbbreviation} onChange={(e) => updateBankAbbr(e.target.value)} id="floatingInput" placeholder="name@example.com" />
                <label >Bank Abbriviation</label>
              </div>

              <div className="d-grid">
                <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit">Create Bank</button>
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

export default CreateBank;