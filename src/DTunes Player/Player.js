import { useEffect, useState } from "react";
import "./Player.css";
import SpotifyPlayer from "react-spotify-web-playback";
import axios from "axios";

function Player(props)
{
    const [playState, setPlayState] = useState(true);
    const [songIndex, setSongIndex] = useState(0);
    const [trackName, setName] = useState("No Audio");
    const [trackArtists, setArtists] = useState("None");
    const [trackImage, setImage] = useState("/Resources/Delta.png");
    const [trackURL, setTrackURL] = useState("");
    const [trackID, setTrackID] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [roll, setRoll] = useState("");
    const [likes, setLikes] = useState("");

    useEffect(() => {
        getSongDetails();
        getLikedSongs();
        setRoll(window.sessionStorage.getItem("roll"));
    })

    function togglePlayState()
    {
        setPlayState(!playState);
    }

    async function getSongDetails()
    {
        if(props["trackID"] != "")
        {
            let url = "https://api.spotify.com/v1/tracks/" + props["trackID"][songIndex]; 
            const {data} = await axios.get(url, {
                headers : {
                    Authorization : `Bearer ${ props["token"] }`
                }
            });
            let artists = "";
            for(let i in data["artists"])
            {
                artists = artists + data["artists"][i]["name"] + ",";
            }
            let liked = false;
            if(likes != "")
            {
                for(let i in likes.split(","))
                {
                    if(likes.split(",")[i] == props["trackID"][songIndex])
                    {
                        liked = true;
                        break;
                    }
                }
            }
            setTrackID(props["trackID"][songIndex]);
            setIsLiked(liked);
            setArtists(artists.slice(0, artists.length - 1));
            setTrackURL(data["uri"]);
            setName(data["name"]);
            setImage(data["album"]["images"][0]["url"]);
        }
    }

    function getLikedSongs()
    {
        let url = "http://localhost:80/DTunes/backend/UserInfo.php";
        let values = {
            operation : "retrieve",
            roll : roll
        }
        fetch(url, {
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(values)
        }).then((response) => response.json()).then((data) => {
            data = data.split(":");
            setLikes(data[1]);
        });
    }

    function updateLike()
    {
        let url = "http://localhost:80/DTunes/backend/UserInfo.php";
        let templikes = likes.split(",");
        let count = templikes.length;
        if(isLiked)
        {
            delete templikes[templikes.indexOf(trackID)];
            count -= 1;
        }
        else
        {
            if(!(templikes.includes(trackID)))
            {
                templikes.push(trackID);
                count += 1;
            }
        }
        let fetchdata = "likes:";
        let fetchdata2 = "";
        for(let i in templikes)
        {
            fetchdata = fetchdata + templikes[i] + (templikes[i] == "" ? "" : ",");
            fetchdata2 = fetchdata2 + templikes[i] + ",";
        }
        if(fetchdata[fetchdata.length - 1] == ",")
        {
            fetchdata = fetchdata.slice(0, fetchdata.length - 1);
        }
        fetchdata2 = fetchdata2.slice(0, fetchdata2.length - 1);
        let data = {
            roll : roll,
            operation : "fetch",
            fetchdata : fetchdata,
            fetchdata2 : fetchdata2,
            count : count
        }
        console.log(data);
        fetch(url, {
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        });
        setIsLiked(!isLiked);
    }

    function nextSong(status)
    {
        if(trackURL != "" && playState && status["type"] == "player_update" && !status["isPlaying"] && songIndex < 11)
        {
            console.log("Next songs");
            setSongIndex(songIndex + 1);
        }
    }

    return(
        <div className = "player">
            <img className = "trackimage" src = { trackImage } alt = "err" />
            <div className = "trackdetails">
                <h1>{ trackName }</h1>
                <marquee>{ trackArtists }</marquee>
            </div>
            <img className = "like" src = {isLiked ? "/Resources/Like.png" : "/Resources/Unlike.png" } alt = "err" onClick = { updateLike } />
            <div className = "controls">
                <img className = "playpause" src = { playState ? "/Resources/Pause.png" : "/Resources/Play.png" } alt = "" onClick = { togglePlayState } />
                &nbsp;&nbsp;
                <img className = "next" src = "/Resources/Next.png" alt = "" />
            </div>
            <SpotifyPlayer  token = { props["token"] }
                            play = { playState }
                            uris = { trackURL }
                            callback = { (status) => { nextSong(status) } }
            />
        </div>
    );
}

export default Player;