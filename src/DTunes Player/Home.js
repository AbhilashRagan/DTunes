import "./Home.css";
import SideBar from "./SideBar";
import { useEffect, useState } from "react";
import axios from "axios";
import Player from "./Player";
import GetRecommendations from "./GetRecommendations";

function Home()
{
    var authURL = "https://accounts.spotify.com/authorize?client_id=ec311608336045109b28d33aeebacfa0&response_type=token&redirect_uri=http://localhost:3000/home&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

    const [token, setToken] = useState("");
    const [roll, setRoll] = useState("");
    const [search, setSearch] = useState("");
    const [trackID, setTrackID] = useState("");
    const [lyrics, setLyrics] = useState("");

    useEffect(() => {
        try
        {
            if(token == "")
            {
                window.sessionStorage.setItem("token", window.location.hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]);
                setToken(window.location.hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]);
            }
        }
        catch
        {
            console.log("Token not recieved");
        }
        setRoll(window.sessionStorage.getItem("roll"));
    });

    function handleSearchBar(e)
    {
        setSearch(e.target.value);
    }

    function updateStatus(id)
    {
        let url = "http://localhost:80/DTunes/backend/friends/UpdateStatus.php";
        let values = {
            roll : roll,
            id : id
        };
        fetch(url, {
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(values)
        });
    }

    async function getLyrics(artist, name)
    {
        let url = "https://api.lyrics.ovh/v1/" + artist + "/" + name;
        fetch(url, {
            headers : {
                'Content-type' : 'application/json'
            }
        }).then((response) => response.json()).then((data) => data["error"] == "No lyrics found" ? setLyrics("Lyrics not found") : setLyrics(data["lyrics"]));
    }

    async function searchTrack(e)
    {
        if(e["keyCode"] == 13)
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
            updateStatus(data["tracks"]["items"][0]["id"]);
            getLyrics(data["tracks"]["items"][0]["artists"][0]["name"], data["tracks"]["items"][0]["name"])
            GetRecommendations(token, data["tracks"]["items"][0]["artists"][0]["id"], data["tracks"]["items"][0]["id"]).then((data) => setTrackID(data));
            setSearch("");
        }
    }

    var apilink =   <div className = "api">
                        <a href = { authURL }>Link Spotfiy</a>
                    </div>

    return(
        <div>
            <img className = "background" src = "/Resources/Background.png" alt = "err" />
            <div className = "homecontents">
                <br/>
                <div className = "searchbar">
                    <input type = "text" name = "search" value = { search } placeholder = "Search" onKeyDown = { searchTrack } onChange = { handleSearchBar } />
                    <img src = "/Resources/Search.webp" alt = "err" />
                </div>
                <div className = "lyrics">
                    <h1>Lyrics</h1>
                    { lyrics }
                </div>
            </div>
            { token == "" ? apilink : <Player token = { token } trackID = { trackID } /> }
            <SideBar />
        </div>
    );
}

export default Home;