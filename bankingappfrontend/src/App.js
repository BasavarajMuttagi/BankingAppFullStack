import { Route,  Routes } from 'react-router-dom'
import AdminDashBoard from './adminDashBoard/adminDashBoard';
import CreateBank from './adminDashBoard/createBank';
import Login from './login/login';
import UserDashBoard from './userDashBoard/userDashBoard';
import CreateCustomer from './adminDashBoard/createCustomer';
import GetAllBanks from './adminDashBoard/getAllBanks';
import GetAllCustomers from './adminDashBoard/getAllCustomers';

import Deposit from './userDashBoard/deposit';
import Transfer from './userDashBoard/transfer';
import SelfTransfer from './userDashBoard/selfTransfer';
import WithDraw from './userDashBoard/withdraw';
import PassBook from './userDashBoard/passBook';
import CreateBankAccount from './adminDashBoard/createBankAccount';
import ImageUpload from './imageUpload/imageUpload';




function App() {
  return (
    <Routes>
    <Route exact path='/adminDashBoard' element={<AdminDashBoard/>} />
    <Route exact path='/userDashBoard'  element={<UserDashBoard/>} />
    <Route exact path='/createBank'  element={<CreateBank/>} />
    <Route exact path='/createCustomer'  element={<CreateCustomer/>} />
    <Route exact path='/getAllBanks'  element={<GetAllBanks/>} />
    <Route exact path='/getAllCustomers'  element={<GetAllCustomers/>} />
    <Route exact path='/createBankAccount'  element={<CreateBankAccount/>} />
    <Route exact path='/deposit'  element={<Deposit/>} />
    <Route exact path='/transfer'  element={<Transfer/>} />
    <Route exact path='/selfTransfer'  element={<SelfTransfer/>} />
    <Route exact path='/withDraw'  element={<WithDraw/>} />
    <Route exact path='/passbook'               element={<PassBook/>} />
    <Route exact path='/img'               element={<ImageUpload/>} />
    <Route exact path='/'               element={<Login/>} />
  </Routes>
  )
}

export default App;
