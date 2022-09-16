import axios from 'axios';
import React,{ useEffect,useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import NavBarUser from './navBarUser';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Transfer() {
    // const [usernameOfSender, updateUserNameSender] = useState("")
    const [usernameOfReceiver, updateUserNameReceiver] = useState("")
    const [bankAbbreviationSender, updateBankAbbrSender] = useState("")
    const [bankAbbreviationReceiver, updateBankAbbrReceiver] = useState("")
    const [amount, updateAmount] = useState()
    const [loginStatus, updateloginStatus] = useState("")
    const [bankObj, updateBankObj] = useState([])
    const [receiverObj, updateReceiverObj] = useState([])
    const [receiverBankObj, updateReceiverBankObj] = useState([])
    const [toggle,setToggle] = useState('')
    const handleMyTransfer = (e) =>{
            e.preventDefault()
            const usernameOfSender = localStorage.getItem('userName')
             axios.post("http://localhost:8080/api/transfer",{usernameOfSender,usernameOfReceiver,bankAbbreviationSender,bankAbbreviationReceiver,amount}).then(resp=>{
              if(resp.status === 200){
                updateloginStatus(resp.data)
                console.log(resp);
                setToggle(resp)
            }
            }).catch(err=>{
              updateloginStatus(err.response.data)
              console.log(err);
            })
    }
    
  const transferSuccessToast =()=>{
    return (
      <div>
      {  toast.success('Transfer Successful')}
        <ToastContainer
    position="bottom-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    />
      </div>
    );

  } 
   let dropDownForReceiver = Object.values(receiverObj).map((eachUser)=>{return(<option value={eachUser.credential.userName} key={eachUser.credential.userName}>{eachUser.credential.userName}</option>)})
    const handleMyDropDownReceiver = () =>{

       axios.get("http://localhost:8080/api/getallcustomers",{}).then(resp=>{
        if(resp.status === 200){
          updateReceiverObj(resp.data)
          console.log(resp.data);
          
      }
      }).catch(err=>{
        // updateloginStatus(err.response.data)
        console.log(err);
      })
    }
  
    let dropDownForReceiverBank = Object.values(receiverBankObj).map((eachBank)=>{return(<option value={eachBank.bankAbbreviation} key={eachBank.bankAbbreviation}>{eachBank.bankAbbreviation}</option>)})
    const handleMyDropDownReceiverBank = () =>{
      if(usernameOfReceiver!==''){
      console.log(usernameOfReceiver + "hekll");
       axios.post("http://localhost:8080/api/getallcustomerbanks",{userName:usernameOfReceiver}).then(resp=>{
        if(resp.status === 200){
          updateReceiverBankObj(resp.data)
          console.log(resp.data);
          
      }
      }).catch(err=>{
        // updateloginStatus(err.response.data)
        console.log(err);
      })
    }
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
        
        console.log(err);
      })
    }
  

useEffect(()=>{
  handleMyDropDown()
  handleMyDropDownReceiver()
  handleMyDropDownReceiverBank()
},[usernameOfReceiver])


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
            <h5 className="card-title text-center mb-5 fw-light fs-5">Transfer</h5>
            <form onSubmit={handleMyTransfer} >
        
              <div className="mb-3"> 
                      <label  className="form-label">Bank Abbriviation of Sender</label>
                      <select className="form-select"  value={bankAbbreviationSender} onChange={(e) => updateBankAbbrSender(e.target.value)}>
                     <option selected >Select A Bank</option>
                        {dropDown}
                      </select>       
                </div> 
            
                  <div className="mb-3"> 
                      <label  className="form-label">UserName Of Receiver</label>
                      <select className="form-select"  value={usernameOfReceiver} onChange={(e) => { updateUserNameReceiver(e.target.value) }}>
                     <option selected >Select A User</option>
                        {dropDownForReceiver}
                      </select>       
                </div> 
            
              <div className="mb-3"> 
                      <label  className="form-label">Bank Abbriviation Of Receiver</label>
                      <select className="form-select"  value={bankAbbreviationReceiver} onChange={(e) => updateBankAbbrReceiver(e.target.value) }>
                     <option selected >Select A Bank</option>
                        {dropDownForReceiverBank}
                      </select>       
                </div> 

              <div className="form-floating mb-3">
                <input type="text" className="form-control" value={amount} onChange={(e) => updateAmount(e.target.value)} id="floatingInput" placeholder="name@example.com" />
                <label >Amount</label>
              </div>
              <div className="d-grid">
                <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit">Transfer</button>
              </div>
              <h1-6 m-2>Message :<span className="badge bg-primary m-2">{loginStatus}</span></h1-6>
              
            </form>
            
          </div>
        </div>
      </div>
    </div>
  </div>
  { toggle.status === 200 ? transferSuccessToast() : null}
    </> );
}

export default Transfer;