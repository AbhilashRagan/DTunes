import Login from "./Authentication/Login";
import SignIn from "./Authentication/SignIn";
import Home from "./DTunes Player/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Playlist from "./DTunes Player/Playlist";
import CreatePlaylist from "./DTunes Player/CreatePlaylist";
import Friends from "./DTunes Player/Friends";
import DJMode from "./DTunes Player/DJMode";
import Statistics from "./DTunes Player/Statistics";

function App()
{
    return(
      <div className = "App">
        <BrowserRouter>
          <Routes>
            <Route path = "/" element = { <Login /> } />
            <Route path = "/signin" element = { <SignIn /> } />
            <Route path = "/home" element = { <Home /> } />
            <Route path = "/playlist" element = { <Playlist /> } />
            <Route path = "/createplaylist" element = { <CreatePlaylist /> } />
            <Route path = "/friends" element = { <Friends /> } />
            <Route path = "/djmode" element = { <DJMode /> } />
            <Route path = "/statistics" element = { <Statistics /> } />
          </Routes>
        </BrowserRouter>
      </div>
    )
}

export default App;
