import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
// import SignUp from './Components/SignUp'
import './Components/MainContainer'
import MainContainer from './Components/MainContainer';
import Welcome from './Components/Welcome';
import ChatArea from './Components/ChatArea';
import Groups from './Components/Groups';
import CreateGroups from './Components/CreateGroups';
import Users from './Components/Users';
import Chats from './Components/Chats';
import { useSelector } from 'react-redux';

function App() {
  const lightTheme = useSelector((state) => state.themeKey);


  return (
    <div className={"App" + (lightTheme ? "" : " dark3")}>



      <Routes>
        {/* <Route path='' element={<Login/>}/> */}
        {/* <Route path='user'> */}
        <Route path='/' element={<Login/>}/>
        {/* <Route path='/register' element={<SignUp/>}/> */}
        {/* </Route> */}
        <Route path='app' element={<MainContainer/>}>
          <Route path='welcome' element={<Welcome/>}/>
          <Route path='' element={<Chats/>}/>
          <Route path='chat/:_id' element={<ChatArea/>}/>
          <Route path='users-online' element={<Users/>}/>
          <Route path='groups' element={<Groups/>}/>
          <Route path='create-group' element={<CreateGroups/>}/>
        </Route>
      </Routes>
       
      
    </div>
  );
}

export default App;
