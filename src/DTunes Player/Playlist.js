import "./Playlist.css";
import SideBar from "./SideBar";
import { useEffect, useState } from "react";
import axios from "axios";
import SpotifyPlayer from "react-spotify-web-playback";
import { useNavigate } from "react-router-dom";

function Playlist()
{
    const [token, setToken] = useState("");
    const [roll, setRoll] = useState("");
    const [search, setSearch] = useState("");
    const [playState, setPlayState] = useState(false);
    const [myplaylists, setMyPlaylists] = useState("No playlists");
    const [searchList, setSearchList] = useState("");
    const [trackID, setTrackID] = useState("");
    const [trackURIs, setTrackURIs] = useState("");
    const [songlist, setSongList] = useState("");
    const [playlistName, setPlaylistName] = useState("No Playlist");
    const [playlistAuthor, setPlaylistAuthor] = useState("None");
    const [songIndex, setSongIndex] = useState(0);

    const nav = useNavigate();

    useEffect(() => {
        if(myplaylists == "No playlists")
        {
            getPlaylists();
        }
        if(roll == "")
        {
            setRoll(window.sessionStorage.getItem("roll"));
        }
        if(token == "")
        {
            setToken(window.sessionStorage.getItem("token"));
        }
    });

    function handleSearch(e)
    {
        setSearch(e.target.value);
    }

    function createplaylist()
    {
        nav("/createplaylist");
    }

    function populateSearchList(data)
    {
        let author = data["author"];
        let count = data["count"];
        author = author.slice(0, author.length - 1);
        count = count.slice(0, count.length - 1);
        if(author != "No playlists found")
        {
            let elements = [];
            elements.push(<br/>);
            for(let i in author.split(","))
            {
                let elem = <button className = "name" onClick = { () => { selectedList(author.split(",")[i], search) } } >{ search }&emsp;<h1 className = "roll">{ author.split(",")[i] }</h1></button>;
                elements.push(elem);
                elements.push(<br/>);
            }
            setSearchList(elements);
            setSearch("");
        }
        else
        {
            alert("No playlists found");
            setSearch("");
            setSearchList("");
        }
    }

    function searchPlaylists(e)
    {
        if(e.keyCode == 13)
        {
            let url = "http://localhost:80/DTunes/backend/playlists/SearchPlaylists.php";
            let values = {
                playlistname : search
            }
            fetch(url, {
                method : 'POST',    
                headers : {
                    'Accept' : 'application/json',
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify(values)
            }).then((response) => response.json()).then((data) => populateSearchList(data));
        }
    }

    async function populateSelectedPlaylist(localtrackID)
    {
        let tracks = [];
        let urilist = [];
        for(let i in localtrackID.split(","))
        {
            let url = "https://api.spotify.com/v1/tracks/" + localtrackID.split(",")[i];
            const {data} = await axios.get(url, {
                headers : {
                    Authorization : `Bearer ${ token }`
                }
            });
            let artists = "";
            for(let j in data["artists"])
            {
                artists = artists + data["artists"][j]["name"] + ",";
            }
            artists = artists.slice(0, artists.length - 1);
            let listelem =  <div className = "elem">
                                <img className = "trackimage" src = { data["album"]["images"][0]["url"] } alt = "err" />
                                &emsp;
                                <h1 className = "trackname">{ data["name"] }</h1>
                                &emsp;
                                <h1 className = "artistname">{ artists }</h1>
                            </div>
            tracks.push(listelem);
            tracks.push(<br/>);
            urilist.push(data["uri"]);
        }
        setSongList(tracks);
        setTrackURIs(urilist);
    }

    function selectedList(roll, data)
    {
        let fetchdata = {
            filename : roll + data + ".txt"};   
        let url = "http://localhost:80/DTunes/backend/playlists/GetPlaylistSongs.php";
        fetch(url, {
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(fetchdata)
        }).then((response) => response.json()).then((data1) => {
            setTrackID(data1);
            setSearchList("");
            setPlaylistName(data);
            setPlaylistAuthor(roll);
            populateSelectedPlaylist(data1);
            setSongIndex(0);
        });
    }

    function populatePlayList(data)
    {
        let data1 = data["name"].slice(0, data["name"].length - 1);
        let data2 = data["count"].slice(0, data["count"].length - 1);
        data1 = data1.split(",");
        data2 = data2.split(",");
        let list = [];
        list.push(
            <h1>Playlists</h1>
        )
        for(let i in data1)
        {
            list.push(
                <button onClick = { () => { selectedList(roll, data1[i])} } >{ data1[i] }<h1 className = "count">&emsp;&emsp;&emsp;{ data2[i] } songs</h1></button>
            );
            list.push(<br/>);
        }
        setMyPlaylists(list);
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
        }).then((response) => response.json()).then((data) => {
            if(data != "No playlists")
            {
                console.log(data);
                populatePlayList(data);
            }
        });
    }

    function togglePlayState()
    {
        setPlayState(!playState);
    }

    function nextSong(status)
    {
        if(trackURIs != "" && playState && status["type"] == "player_update" && !status["isPlaying"])
        {
            setSongIndex(songIndex + 1);
        }
    }

    return(
        <div>
            <img className = "background" src = "/Resources/Background.png" alt = "error" />
            <div className = "playlistcontent">
                <br/>
                <div className = "searchbar">
                    <img src = "/Resources/Search.webp" alt = "error" />
                    <input type = "text" value = { search } placeholder = "Search" onKeyDownCapture = { searchPlaylists } onChange = { handleSearch } />
                    <div className = "searchlist">
                        { searchList }
                    </div>
                </div>
                <br/><br/>
                <div className = "selectedplaylist">
                    <img src = "/Resources/Delta.png" alt = "err" />
                    <br/>
                    <img className = "playpause" src = { playState ? "/Resources/Pause.png" : "/Resources/Play.png" } alt = "" onClick = { togglePlayState } />
                    <h1 className = "playlistname" >{ playlistName }</h1>
                    <h1 className = "authorname" >{ playlistAuthor }</h1>
                    <div className = "list">
                        { songlist }
                    </div>
                </div>
            </div>
            <div className = "create">
                <div className = "songlist">
                    { myplaylists == "" ? <h1>No playlists found</h1> : myplaylists }
                </div>
                <br/>
                <button  onClick = { createplaylist }>Create +</button>
            </div>
            <SideBar />
            <SpotifyPlayer  token = { token }
                            play = { playState }
                            uris = { trackURIs[songIndex] } 
                            callback = { (status) => nextSong(status) }
            />
        </div>
    );
}

export default Playlist;