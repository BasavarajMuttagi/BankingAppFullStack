import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link } from 'react-router-dom';
import NavBarUser from "./navBarUser";
import jsonrawtoxlsx from "jsonrawtoxlsx";
import ReactSwitch from "react-switch";
var FileSaver = require('file-saver');


function PassBook() {
  const [ObjArr,setObjArr] = useState({})
  const [responseLength,setResponseLength] = useState(0)
  const [errorObj,setErrorObj] = useState({})
  const [errorToggle,setErrorToggle] = useState(false)
  const [ObjArrExport,setObjArrExport] = useState({})
  const [totalBalance,setTotalBalance] = useState(0)
  const [color,setColor] = useState('table')
  const [Switch,setSwitch] = useState(false)
  const [Name,setName] = useState('Dark Mode')
  function toggleColor(){
    setColor(color === 'table'? 'table table-dark':'table')
    setSwitch(Switch === false ? true : false)
    setName(Name === 'Light Mode'?'Dark Mode':'Light Mode')
    
  }
  
  const handlePassBook =()=>{
      const userName = localStorage.getItem('userName')
      axios.post("http://localhost:8080/api/passbook",{userName})
      .then((resp)=>{
          setObjArr(resp.data.transactions)
          setTotalBalance(resp.data.totalBalance)
          // console.log(resp.data);
          if(Object.keys(resp.data).length >0){
              setResponseLength(Object.keys(resp.data).length)
          }
          
      })
      .catch((err)=>{
          setErrorObj(err)
          setErrorToggle(true)
          // console.log(err.response);
      })
  }
 
  function exportXLSX(jsonObjArray){
    const buffer = jsonrawtoxlsx(jsonObjArray);
    const userName = localStorage.getItem('userName')
    const fileName = userName + '.xlsx'
    var blob = new Blob([buffer], {type: "binary"});
    FileSaver.saveAs(blob, fileName);

  }

  const handleExport =()=>{
    const userName = localStorage.getItem('userName')
    axios.post("http://localhost:8080/api/getxlsx",{userName})
    .then((resp)=>{
        setObjArrExport(resp.data)
        console.log(resp.data);
        if(Object.keys(resp.data).length >0){
            setResponseLength(Object.keys(resp.data).length)
        }
        
    })
    .catch((err)=>{
        setErrorObj(err)
        setErrorToggle(true)
        // console.log(err.response);
    })
}
  

  useEffect(()=>{
  handlePassBook()
  handleExport()
  },[])
  
  let allTrnx = Object.values(ObjArr).map((eachElement)=>{
      return(
          <React.Fragment key={eachElement._id}>
          <tbody>
              <tr>
                <td key={eachElement.type}>{eachElement.type}</td>
                <td key={eachElement.customer.firstName}>{eachElement.customer.firstName}</td>
                <td key={eachElement.amount} className = {eachElement.amount < 0 ?"bg-danger":"bg-success"}>{eachElement.amount}</td>
                <td key={eachElement.createdAt}>{eachElement.createdAt.split('T')[0]}</td>
                <td key={new Date(Date.parse(eachElement.createdAt)).toLocaleTimeString() }>{new Date(Date.parse(eachElement.createdAt)).toLocaleTimeString() }</td>
              </tr>
          </tbody>
          
          </React.Fragment>
    )
  })
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
<div>
<span className="m-3 float-end"><div>{Name}</div><ReactSwitch checked={Switch} onChange={()=>{toggleColor()}} ></ReactSwitch></span>
 <span class="badge bg-success m-3"><h3 >Total Balance : ₹ {totalBalance}</h3></span>
  
  <button type="button" className="btn btn-primary m-3 float-end" onClick={()=>exportXLSX(ObjArrExport)}>Export</button>
</div>
<table className={`${color}`}>
                <thead >
                  <tr>
                
                    <th scope="col">Type</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Amount (₹)</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                  </tr>
                </thead>
                {allTrnx}
            </table>
</>
  );
}

export default PassBook;