import NavBarUser from "./navBarUser";
import { Link } from 'react-router-dom';
function UserDashBoard() {
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
        <NavBarUser/>
     );
}

export default UserDashBoard;