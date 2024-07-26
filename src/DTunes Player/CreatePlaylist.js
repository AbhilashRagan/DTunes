import axios from "axios";
import "./CreatePlaylist.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreatePlaylist()
{
    const [search, setSearch] = useState("");
    const [roll, setRoll] = useState("");
    const [token, setToken] = useState("");
    const [playlistname, setPlaylistName] = useState("");
    const [error, setError] = useState("");
    const [songlist, setSongList] = useState([]);
    const [idList, setIDList] = useState([]);
    const [isPublic, setIsPublic] = useState("0");

    const nav = useNavigate();

    useEffect(() => {
        if(token == "")
        {
            setToken(window.sessionStorage.getItem("token"));
        }
        if(roll == "")
        {
            setRoll(window.sessionStorage.getItem("roll"));
        }
    });

    function handleSearch(e)
    {
        setSearch(e.target.value);
    }

    function handleName(e)
    {
        let string = String(e.target.value);
        if(string.length > 0)
        {
            if(!(string.charCodeAt(0) >= 65 && string.charCodeAt(0) <= 90))
            {
                setError("*First letter should be in caps");
            }
            else
            {
                string = string.slice(1, string.length);
                for(let i in string)
                {
                    if(string[i].charCodeAt(0) < 97 || string[i].charCodeAt(0) > 122)
                    {
                        setError("*Other letters should be small case");
                        break;
                    }
                }
            }
        }
        else
        {
            setError("");
        }
        setPlaylistName(e.target.value);
    }

    async function searchEntered(e)
    {
        if(e.keyCode == 13)
        {
            let url = "https://api.spotify.com/v1/search";
            const {data} = await axios.get(url, {
                headers : {
                    Authorization : `Bearer ${ token }`
                },
                params : {
                    q : search,
                    type : 'track'
                }
            });
            if(!idList.includes(data["tracks"]["items"][0]["id"]))
            {
                let list = [];
                let displaylist = [];
                for(let i = 0;i < songlist.length;i++)
                {
                    displaylist[i] = songlist[i];
                }
                for(let i = 0;i < idList.length;i++)
                {   
                    list[i] = idList[i];
                }
                list[list.length] = data["tracks"]["items"][0]["id"];
                let elem =  <div className = "elem">
                                <img src = { data["tracks"]["items"][0]["album"]["images"][0]["url"] } alt = "error" />
                                &emsp;&emsp;
                                <h1 className = "name">{ data["tracks"]["items"][0]["name"] }</h1>
                                &emsp;&emsp;
                                <h1 className = "artists">{ data["tracks"]["items"][0]["artists"][0]["name"] }</h1>
                            </div>
                displaylist[displaylist.length] = elem;
                displaylist[displaylist.length] = <br/>;
                console.log(displaylist);
                setSongList(displaylist);
                setIDList(list);
                setSearch("");
            }
            else
            {
                alert("Song exists in playlist");
                setSearch("");
            }
        }
    }

    function abort()
    {
        nav("/playlist");
    }

    function togglePublic()
    {
        if(isPublic == "0")
        {
            setIsPublic("1");
        }
        else
        {
            setIsPublic("0");
        }
    }

    function create()
    {
        if(error == "" && songlist != "")
        {
            let ids = "";
            for(let i in idList)
            {
                ids = ids + idList[i] + ",";
            }
            ids = ids.slice(0, ids.length - 1);
            let values = {
                roll : roll,
                name : playlistname,
                ids : ids,
                public : isPublic,
                count : idList.length
            }
            let url = "http://localhost:80/DTunes/backend/playlists/CreatePlaylists.php";
            fetch(url, {
                method : 'POST',
                headers : {
                    'Accept' : 'application/json',
                    'Content-type' : 'applcation/json'
                },
                body : JSON.stringify(values)
            });
        }
        else
        {
            alert("Invalid playlist details.");
        }
    }

    return(
        <div>
            <img className = "background" src = "/Resources/Background.png" alt = "error" />
            <div className = "createcontent">
                <br/>
                <div className = "searchplaylist">
                    <input type = "text" value = { search } placeholder = "Search" onKeyDownCapture = { searchEntered } onChange = { handleSearch } />
                    <img src = "/Resources/Search.webp" alt = "error" />
                </div>
                <br/>
                <div className = "playlistdetails">
                    <img src = "/Resources/Delta.png" alt = "error" />
                    <h1>Enter playlist name</h1>
                    <input type = "text" value = { playlistname } placeholder = "Enter name" onChange = { handleName } />
                    <h1 className = "error">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{ error }</h1>
                    <button style = {{backgroundColor : isPublic == "0" ? "red" : "green"}} onClick = { togglePublic } >Is Public</button>
                </div>
                <br/>
                <div className = "songlist">
                    { songlist }
                </div>
                <button className = "abortbutton" onClick = { abort }>Abort</button>
                <button className = "createbutton" onClick = { create }>Create</button>
            </div>
        </div>
    );
}

export default CreatePlaylist;