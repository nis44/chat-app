import { Route, Router } from "react-router-dom"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import SettingPage from "./pages/SettingPage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"

const App = () => {
  return (
    <div>
      <Navbar/>

      <Router>
        <Route path="/" element = {<HomePage />}/>
        <Route path="/login" element = {<LoginPage />}/>
        <Route path="/profile" element = {<ProfilePage />}/>
        <Route path="/setting" element = {<SettingPage />}/>
        <Route path="/signup" element = {<SignUpPage />}/>
      </Router>
    </div>
  )
}

export default App
