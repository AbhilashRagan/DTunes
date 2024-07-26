import { useNavigate } from "react-router-dom";
import "./SideBar.css"
import { useState, useEffect } from "react";

function  SideBar()
{
    const [showmenu, setShowMenu] = useState(true);
    const [roll, setRoll] = useState("");

    useEffect(() => {
        if(roll == "")
        {
            setRoll(window.sessionStorage.getItem("roll"));
        }
    });

    const nav = useNavigate();

    function toggleSideBar()
    {
        setShowMenu(!showmenu);
    }

    function home()
    {
        nav("/home");
    }

    function playlist()
    {
        nav("/playlist");
    }

    function logout()
    {
        let url = "http://localhost:80/DTunes/backend/friends/UpdateStatus.php";
        let values = {
            roll : roll,
            id : ""
        };
        fetch(url, {
            method : 'POSt',
            headers : {
                'Accept' : 'application/json',
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(values)
        });
        nav("/");
    }

    function friends()
    {
        nav("/friends");
    }

    function djmode()
    {
        nav("/djmode");
    }

    function statistics()
    {
        nav("/statistics");
    }

    const sidebar1 =    <div className = "sidebar" >
                            <br/>
                            <img className = "menu" src = "/Resources/Menu.png" alt = "err" onClick = { toggleSideBar } />
                            <br/><br/><br/><br/><br/><br/><br/><br/><br/>
                            <div className = "buttons">
                                <button onClick = { friends } >&emsp;Friends&emsp; <img src = "/Resources/Friends.png" alt = "err" /></button>
                                <br/><br/>
                                <button onClick = { playlist } >&emsp;Playlist&emsp; <img src = "/Resources/Playlist.png" alt = "err" /></button>
                                <br/><br/>
                                <button onClick = { home } >&ensp;&nbsp;&nbsp;Home&emsp;&ensp;&nbsp; <img src = "/Resources/Home.png" alt = "err" /></button>
                                <br/><br/>
                                <button onClick = { djmode } >&ensp;&nbsp;&nbsp;DJ Mode&emsp;<img src = "/Resources/DJ.png" alt = "err" /></button>
                                <br/><br/>
                                <button onClick = { statistics } >&ensp;Statistics&nbsp;&nbsp;&nbsp;<img src = "/Resources/Statistics.png" alt = "err" /></button>
                                <br/><br/>
                                <button onClick = { logout } >&ensp;&nbsp;&nbsp;Logout&emsp;&nbsp;&nbsp; <img src = "/Resources/Logout.png" alt = "err" /></button>
                            </div>
                        </div>

    const sidebar2 =    <div className = "sidebar2">
                            <br/>
                            <img className = "menu" src = "/Resources/Menu.png" alt = "err"onClick = { toggleSideBar } />
                            <br/><br/><br/><br/><br/><br/><br/><br/><br/>
                            <div className = "buttons2">
                                <img src = "/Resources/Friends.png" alt = "err" onClick = { friends } />
                                <br/><br/>
                                <img src = "/Resources/Playlist.png" alt = "err" onClick = { playlist } />
                                <br/><br/>
                                <img src = "/Resources/Home.png" alt = "err" onClick = { home } />
                                <br/><br/>
                                <img src = "/Resources/DJ.png" alt = "err" onClick = { djmode } />
                                <br/><br/>
                                <img src = "/Resources/Statistics.png" alt = "err" onClick = { statistics } />
                                <br/><br/>
                                <img src = "/Resources/Logout.png" alt = "err" onClick = { logout } />
                            </div>
                        </div>;

    return(
        <div>
            { showmenu ? sidebar1 : sidebar2 }
        </div>
    );
}

export default SideBar;