import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const NavBarUser=()=>{
    const [errorToggle,setErrorToggle] = useState(false)
    const [errorObj,setErrorObj] = useState({})
  
    const navigation = new useNavigate()
    const handleMyLogout = () =>{
  

       axios.post("http://localhost:8080/api/logout",{}).then(resp =>{
        if(resp.status === 200){
          console.log(resp.data);
          localStorage.removeItem('user')
          localStorage.removeItem('userName')
          navigation('/')
        }
      })
      .catch(err=>{
        setErrorToggle(true)
        setErrorObj(err)
        console.log(err.response.data);
      })
  
    }
  
    if(errorToggle){
      return (<div>{errorObj.response.data}</div>)
    }
return(
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/userDashboard">USER DASHBOARD</Link>
            <button className="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavId" aria-controls="collapsibleNavId"
                aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="collapsibleNavId">
                <ul className="navbar-nav me-auto mt-2 mt-lg-0">
                
                    <li className="nav-item">
                        <Link className="nav-link"  to="/withDraw">Withdraw</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link"  to="/deposit">Deposit</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link"  to="/transfer">Transfer</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link"  to="/passbook">Passbook</Link>
                    </li>
                </ul>
    
            </div>
            <button type="button" className="btn btn-primary" style={{"float":"right"}} onClick={()=>{handleMyLogout()}}>Logout</button>
      </div>
    </nav>
    
)
}

export default NavBarUser;