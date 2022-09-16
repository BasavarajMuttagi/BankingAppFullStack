import axios from 'axios';
import React,{ useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import NavBarAdmin from './navBarAdmin';
import { Link } from 'react-router-dom';
function CreateCustomer() {
    const [firstName, updateFirstName] = useState("")
    const [lastName, updateLastName] = useState("")
    const [userName, updateUsername] = useState("")
    const [password, updatePassword] = useState("")
    const [loginStatus, updateloginStatus] = useState("")

    const handleMyCreateCustomer = (e) =>{
            e.preventDefault()
             axios.post("http://localhost:8080/api/CreateCustomer",{firstName,lastName,userName,password}).then(resp=>{
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
            <h5 className="card-title text-center mb-5 fw-light fs-5">Create Customer</h5>
            <form onSubmit={handleMyCreateCustomer} >
              <div className="form-floating mb-3">
                <input type="text" className="form-control" value={firstName} onChange={(e) => updateFirstName(e.target.value)} id="floatingInput" placeholder="name@example.com" />
                <label >firstName</label>
              </div>
             <div className="form-floating mb-3">
                <input type="text" className="form-control" value={lastName} onChange={(e) => updateLastName(e.target.value)} id="floatingInput" placeholder="name@example.com" />
                <label >lastName</label>
              </div>
              <div className="form-floating mb-3">
                <input type="text" className="form-control" value={userName} onChange={(e) => updateUsername(e.target.value)} id="floatingInput" placeholder="name@example.com" />
                <label >Username</label>
              </div>
              <div className="form-floating mb-3">
                <input type="text" className="form-control" value={password} onChange={(e) => updatePassword(e.target.value)} id="floatingPassword" placeholder="Password"/>
                <label >Password</label>
              </div>
              <div className="d-grid">
                <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit">Create Customer</button>
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

export default CreateCustomer;