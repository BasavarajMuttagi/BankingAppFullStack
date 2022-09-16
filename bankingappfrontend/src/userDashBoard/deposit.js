import axios from 'axios';
import React,{ useEffect,useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import NavBarUser from './navBarUser';
import { Link } from 'react-router-dom';
function Deposit() {
    // const [userName, updateUserName] = useState("")
    const [bankAbbreviation, updateBankAbbr] = useState("")
    const [amount, updateAmount] = useState()
    const [loginStatus, updateloginStatus] = useState("")
    const [bankObj, updateBankObj] = useState([])

    const handleMyDeposit = (e) =>{
            e.preventDefault()
            const userName = localStorage.getItem('userName')
             axios.post("http://localhost:8080/api/deposit",{userName,bankAbbreviation,amount}).then(resp=>{
              if(resp.status === 200){
                updateloginStatus(resp.data)
                console.log(resp.data);
            }
            }).catch(err=>{
              updateloginStatus(err.response.data)
              console.log(err);
            })
    }

    let dropDown = Object.values(bankObj).map((eachBank)=>{return(<option value={eachBank.bankAbbreviation} key={eachBank.bankAbbreviation}>{eachBank.bankAbbreviation}</option>)})
    
    const handleMyDropDown = () =>{
      const userName = localStorage.getItem('userName')
       axios.post("http://localhost:8080/api/getallcustomerbanks",{userName}).then(resp=>{
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
if(loggedInUser !== 'user')
{
  return ( 
    
    <div className="nav-item active">
      Please Login As User  <Link className="nav-link bg-primary badge" to="/" >Here<span className="visually-hidden">(current)</span></Link>
    </div>
      
    );
}
    return ( 
    <>
    <NavBarUser/>
    <div className="container">
    <div className="row">
      <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div className="card border-0 shadow rounded-3 my-5">
          <div className="card-body p-4 p-sm-5">
            <h5 className="card-title text-center mb-5 fw-light fs-5">Deposit</h5>
            <form onSubmit={handleMyDeposit} >

                <div className="mb-3"> 
                      <label  className="form-label">Bank</label>
                      <select className="form-select"  value={bankAbbreviation} onChange={(e) => updateBankAbbr(e.target.value)}>
                     <option selected >Select A Bank</option>
                        {dropDown}
                      </select>       
                </div> 
                
              <div className="form-floating mb-3">
                <input type="text" className="form-control" value={amount} onChange={(e) => updateAmount(e.target.value)} id="floatingInput" placeholder="name@example.com" />
                <label >Amount</label>
              </div>
              <div className="d-grid">
                <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit">Deposit</button>
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

export default Deposit;