import NavBarAdmin from "./navBarAdmin";
import { Link } from 'react-router-dom';
function AdminDashBoard() {
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
        <NavBarAdmin/>
     );
}

export default AdminDashBoard;