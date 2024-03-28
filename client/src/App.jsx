import { BrowserRouter, Route, Routes  } from "react-router-dom"
import { Home } from "./pages/Home"
import { Signin } from "./pages/Signin"
import { Profile } from "./pages/Profile"
import { SignUp } from "./pages/SignUp"
import { About } from "./pages/About"
import { Header } from "./components/Header"



function App() {
 

  return (
    
    <BrowserRouter>
    <Header/>
    <Routes>
    <Route path="/" element = {<Home/>}></Route>
    <Route path="/signin" element = {<Signin />}></Route>
    <Route path="/signup" element = {<SignUp/>}></Route>
    <Route path="/profile" element = {<Profile/>}></Route>
    <Route path="/about" element = {<About/>}></Route>
    
    </Routes>
    </BrowserRouter>
    
   
  )
}

export default App
