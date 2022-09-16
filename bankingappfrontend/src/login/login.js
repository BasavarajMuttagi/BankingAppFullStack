import axios from 'axios';
import React,{ useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from "react-router-dom";
// import Img from './LoginBackGround.jpg'
function Login() {
    
    const [userName, updateUsername] = useState("")
    const [password, updatePassword] = useState("")
    // const [user, setUser] = useState('')
    const [loginStatus, updateloginStatus] = useState("")

    const navigation = new useNavigate()
    const handleMyLogin = async(e) =>{
        e.preventDefault()
        console.log(userName,password);
        await axios.post("http://localhost:8080/api/login",{userName,password}).then(resp=>{
          if(resp.status === 200){
            // setUser(resp.data)
            console.log(resp);
            localStorage.setItem('user', resp.data)
            localStorage.setItem('userName',userName)
            console.log(userName);
            if(resp.data === 'admin'){
                navigation('/adminDashBoard')
            }
            else{
            navigation('/userDashBoard')
            }
        }
        }).catch(err=>{
          updateloginStatus(err.response.data)
          console.log(err.response.data);
        })
      
    }
    
return (
 
  <div className="container">
    <div className="row">
      <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div className="card border-0 shadow rounded-3 my-5">
          <div className="card-body p-4 p-sm-5">
            <h5 className="card-title text-center mb-5 fw-light fs-5">Login</h5>
            <form onSubmit={handleMyLogin} >
              <div className="form-floating mb-3">
                <input type="text" className="form-control" value={userName} onChange={(e) => updateUsername(e.target.value)} id="floatingInput" placeholder="name@example.com" />
                <label >Username</label>
              </div>
              <div className="form-floating mb-3">
                <input type="text" className="form-control" value={password} onChange={(e) => updatePassword(e.target.value)} id="floatingPassword" placeholder="Password"/>
                <label >Password</label>
              </div>

              <div className="d-grid">
                <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit">Login</button>
              </div>
              <h1-6 m-2>Message :<span className="badge bg-primary m-2">{loginStatus}</span></h1-6>
            </form>
          </div>
        </div>
      </div>
    </div>
    
  </div>
  
    );
}

export default Login;