import "./Friends.css";
import SideBar from "./SideBar";
import axios from "axios";
import { useEffect, useState } from "react";

function Friends()
{
    const [search, setSearch] = useState("");
    const [roll, setRoll] = useState("");
    const [token, setToken] = useState("");
    const [requests, setRequests] = useState("");
    const [myfriends, setMyFriends] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setRoll(window.sessionStorage.getItem("roll"));
        if(token == "")
        {
            setToken(window.sessionStorage.getItem("token"));
        }
        if(requests == "")
        {
            getRequests();
        }
        if(myfriends == "")
        {
            getFriends();
        }
    });

    function handleSearch(e)
    {
        let err = "";
        if(String(e.target.value).length != 9)
        {
            err = "*Invalid id";
        }
        let inp = String(e.target.value);
        for(let i in inp)
        {
            if(!(inp[i].charCodeAt(0) >= 48 && inp[i].charCodeAt(0) <= 57))
            {
                err = "*Invalid id";
                break;
            }
        }
        if(e.target.value == "")
        {
            err = "";
        }
        setError(err);
        setSearch(e.target.value);
    }

    async function populateFriends(friendsdata)
    {
        let data1 = friendsdata["message"].slice(0, friendsdata["message"].length - 1);
        let data2 = friendsdata["ids"].slice(0, friendsdata["ids"].length - 1);
        data2 = data2.split(",");
        if(data1 != "")
        {
            let elements = [];
            for(let i in data1.split(","))
            {
                if(data2[i] == "")
                {
                    let elem =  <div className = "elem">
                                    <h1>{ data1.split(",")[i] }</h1>&emsp;
                                    <h1 className = "offline">Offline</h1>
                                </div>
                    elements.push(elem);
                    elements.push(<br/>);
                }
                else
                {
                    let url = "https://api.spotify.com/v1/tracks/" + data2[i];
                    const {data} = await axios.get(url, {
                        headers : {
                            Authorization : `Bearer ${ token }`
                        }
                    });
                    let elem =  <div className = "elem">
                                    <h1>{ data1.split(",")[i] }</h1>&emsp;
                                    <img src = { data["album"]["images"][0]["url"] } alt = "error" />&emsp;
                                    <h1 className = "trackname">{ data["name"] }</h1>
                                </div>
                    elements.push(elem);
                    elements.push(<br/>);
                }
            }
            setMyFriends(elements);
        }
    }

    function getFriends()
    {
        let url = "http://localhost:80/DTunes/backend/friends/GetFriends.php";
        let values = {
            roll : roll
        };
        fetch(url, {
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(values)
        }).then((response) => response.json()).then((data) => populateFriends(data));
    }

    function acceptRequest(friend1)
    {
        let url = "http://localhost:80/DTunes/backend/friends/AcceptRequest.php";
        let values = {
            friend1 : friend1,
            friend2 : roll
        };
        fetch(url, {
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(values)
        });
        console.log(values);
        window.location.reload();
    }

    function populateRequests(myrequests)
    {
        let elements = [];
        myrequests = myrequests.slice(0, myrequests.length - 1);
        if(myrequests != "")
        {
            for(let i in myrequests.split(","))
            {
                let elem =  <h1>
                                { myrequests.split(",")[i] }&emsp;
                                <button onClick = { () => { acceptRequest(myrequests.split(",")[i]) } } >Accept</button>
                            </h1>
                elements.push(elem);
            }
            setRequests(elements);
        }
    }

    function getRequests()
    {
        let url = "http://localhost:80/DTunes/backend/friends/GetRequests.php";
        let values = {
            roll : roll
        }
        fetch(url, {
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(values)
        }).then((response) => response.json()).then((data) => populateRequests(data));
    }

    function sendRequest(e)
    {
        if(e.keyCode == 13 && error == "")
        {
            let url = "http://localhost:80/DTunes/backend/friends/FriendRequest.php";
            let values = {
                friend1 : roll,
                friend2 : search
            };
            fetch(url, {
                method : 'POST',
                headers : {
                    'Accept' : 'application/json',
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify(values)
            }).then((response) => response.json()).then((data) => {
                alert(data);
                setSearch("");
            });
        }
    }

    return(
        <div>
            <img className = "background" src = "/Resources/Background.png" alt = "error" />
            <div className = "friendscontent">
                <br/>
                <div className = "search">
                    <img src = "/Resources/Search.webp" alt = "err" />
                    <input type = "text" value = { search } placeholder = "Enter user id" onChange = { handleSearch } onKeyDownCapture = { sendRequest } />
                    <h1 className = "error">&emsp;&emsp;{ error }</h1>
                </div>
                <br/><br/><br/><br/><br/><br/>
                <div className = "friends">
                    <h1 className = "title">My Friends</h1>
                    { myfriends }
                </div>
            </div>
            <div className = "requests">
                <h1>Requests</h1>
                { requests }
            </div>
            <SideBar />
        </div>
    );
}

export default Friends;