import { BrowserRouter, Route, Routes  } from "react-router-dom"
import { Home } from "./pages/Home"
import { Signin } from "./pages/Signin"
import { Profile } from "./pages/Profile"
import { SignUp } from "./pages/SignUp"
import { About } from "./pages/About"
import { Header } from "./components/Header"
import { PrivateRoute } from "./components/PrivateRoute"
import { CreateListing } from "./pages/CreateListing"



function App() {
 

  return (

    <BrowserRouter>
    <Header/>
    <Routes>
    <Route path="/" element = {<Home/>}></Route>
    <Route path="/signin" element = {<Signin />}></Route>
    <Route path="/signup" element = {<SignUp/>}></Route>
    <Route path="/about" element = {<About/>}></Route>
    < Route element = {<PrivateRoute/>}>
    <Route path="/profile" element = {<Profile/>}></Route>
    <Route path="/create-listing" element ={<CreateListing/>} ></Route>
    </Route>
    </Routes>
    </BrowserRouter>
    
   
  )
}

export default App
