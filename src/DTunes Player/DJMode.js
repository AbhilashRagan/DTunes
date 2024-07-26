import { useEffect, useState } from "react";
import "./DJMode.css";
import SideBar from "./SideBar";
import axios from "axios";

function DJMode()
{
    const [roll, setRoll] = useState("");
    const [token, setToken] = useState("");
    const [myplaylists, setPlaylists] = useState("");
    const [urls, setURLs] = useState("");
    const [songIndex, setSongIndex] = useState(0);

    useEffect(() => {
        if(roll == "")
        {
            setRoll(window.sessionStorage.getItem("roll"));
        }
        if(token == "")
        {
            setToken(window.sessionStorage.getItem("token"));
        }
        if(myplaylists == "")
        {
            getPlaylists();
        }
    });

    async function playPlaylist(ids)
    {
        let audiourls = [];
        for(let i in ids.split(","))
        {
            let url = "https://api.spotify.com/v1/tracks/" + ids.split(",")[i];
            const {data} = await axios.get(url, {
                headers : {
                    Authorization : `Bearer ${ token }`
                }
            });
            audiourls.push(data["preview_url"]);
        }
        setURLs(audiourls);
        setSongIndex(0);
    }

    function selectedPlaylist(name)
    {
        let filename = roll + name + ".txt";
        let values = {
            filename : filename
        };
        let url = "http://localhost:80/DTunes/backend/playlists/GetPlaylistSongs.php";
        fetch(url, {
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(values)
        }).then((response) => response.json()).then((data) => playPlaylist(data));
    }

    function populatePlaylists(data)
    {
        let list = [];
        if(data == "No playlists")
        {  
            list.push(<h1>No playlists</h1>)
        }
        else
        {
            let names = data["name"].slice(0, data["name"].length - 1);
            let count = data["count"].slice(0, data["count"].length - 1);
            names = names.split(",");
            count = count.split(",");
            for(let i in names)
            {
                let elem = <button onClick = { () => { selectedPlaylist(names[i]) } } >{ names[i] }&emsp;&emsp;&emsp;<h1 className = "count">{ count[i] } songs</h1></button>
                list.push(elem);
                list.push(<br/>);
            }
        }
        setPlaylists(list);
    }

    function getPlaylists()
    {
        let url = "http://localhost:80/DTunes/backend/playlists/GetPlaylists.php";
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
        }).then((response) => response.json()).then((data) => populatePlaylists(data));
    }

    function nextSong()
    {
        setSongIndex(songIndex + 1);
    }

    return(
        <div>
            <img className = "background" src = "/Resources/Background.png" alt = "error" />
            <div className = "djcontent">
                <br/><br/>
                <div className = "myplaylists">
                    <h1 className = "title">My Playlists</h1>
                    { myplaylists }
                </div>
                <audio src = { urls[songIndex] } autoPlay = { true } onEnded = { nextSong } />
            </div>
            <SideBar />
        </div>
    );
}

export default DJMode;