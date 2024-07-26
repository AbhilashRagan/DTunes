import "./Statistics.css";
import SideBar from "./SideBar.js";
import { useEffect, useState } from "react";
import axios from "axios";

function Statistics()
{
    const [roll, setRoll] = useState("");
    const [token, setToken] = useState("");
    const [artists, setArtists] = useState([]);
    const [artistName, setArtistName] = useState("None");
    const [artistImage, setArtistImage] = useState("/Resources/Delta.png"); 
    const [artistGenres, setArtistGenres] = useState("None");
    const [artistPopularity, setArtistPopularity] = useState("None");
    const [artistFollowers, setArtistFollowers] = useState("None");
    const [popularImages, setPopularImages] = useState([]);
    const [releases, setReleases] = useState([]);

    useEffect(() => {
        if(roll == "")
        {
            setRoll(window.sessionStorage.getItem("roll"));
        }
        if(token == "")
        {
            setToken(window.sessionStorage.getItem("token"));
        }
        if(artistName == "None")
        {
            let url = "http://localhost:80/DTunes/backend/playlists/GetPLaylists.php";
            let values = {
                roll : roll
            };
            fetch(url, {
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json',
                    'Accept' : 'application/json'
                }
                ,
                body : JSON.stringify(values)
            }).then((response) => response.json()).then((data) => getPlaylistSongs(data));
        }
    });

    async function getArtistID(data1)
    {
        data1 = data1.split(",");
        for(let i in data1)
        {
            let url = "https://api.spotify.com/v1/tracks/" + data1[i];
            const {data} = await axios.get(url, {
                headers : {
                    Authorization : `Bearer ${ token }`
                }
            });
            for(let i in data["artists"])
            {
                if(data["artists"][i]["id"] in artists)
                {
                    artists.push(data["artists"][i]["id"]);
                }
                else
                {
                    artists.push(data["artists"][i]["id"]);
                }
            }
        }
        getFavouriteArtist();
        setArtists(artists);
    }

    async function getFavouriteArtist()
    {
        let uniques = Array.from(new Set(artists));
        let frequency = {};
        let maxcount = 0;
        let maxartist = "";
        for(let i in uniques)
        {
            let count = 0;
            for(let j in artists)
            {
                if(uniques[i] == artists[j])
                {
                    count += 1;
                }
            }
            frequency[uniques[i]] = count;
        }
        for(let i in frequency)
        {
            if(frequency[i] > maxcount)
            {
                maxcount = frequency[i];
                maxartist = i;
            }
        }
        let url = "https://api.spotify.com/v1/artists/" + maxartist;
        const {data} = await axios.get(url, {
            headers : {
                Authorization : `Bearer ${ token }`
            }
        });
        let url2 = "https://api.spotify.com/v1/artists/" + maxartist + "/albums";
        const data2 = await axios.get(url2, {
            headers : {
                Authorization : `Bearer ${ token }`
            }
        });
        popularImages.splice(0, popularImages.length);
        for(let i in data2["data"]["items"])
        {
            let img = <img src = { data2["data"]["items"][i]["images"][0]["url"] } />;
            if(!(img in popularImages))
            {
                popularImages.push(img);
                popularImages.push(<p>&emsp;</p>)
            }
        }
        let url3 = "https://api.spotify.com/v1/browse/new-releases";
        const data3 = await axios.get(url3, {
            headers : {
                Authorization : `Bearer ${ token }`
            },
            params : {
                limit : 6
            }
        });
        releases.splice(0, popularImages.length);
        for(let i in data3["data"]["albums"]["items"])
        {
            let img = <img src = { data3["data"]["albums"]["items"][i]["images"][0]["url"] } />
            releases.push(img);
        }
        setArtistImage(data["images"][0]["url"]);
        setArtistName(data["name"]);
        setArtistPopularity(data["popularity"]);
        setArtistFollowers(data["followers"]["total"]);
        setArtistGenres(data["genres"][0]);
        setPopularImages(popularImages);
        setReleases(releases);
    }

    function getPlaylistSongs(data)
    {
        if(data == "No playlists" && roll != "")
        {
            setArtistName("No Playlists");
        }
        else
        {
            data = data["name"];
            if(data != undefined)
            {
                data = data.slice(0, data.length - 1);
                data = data.split(",");
                for(let i in data)
                {
                    let filename = roll + data[i] + ".txt";
                    let values = {
                        filename : filename
                    };
                    let url = "http://localhost:80/DTunes/backend/playlists/GetPlaylistSongs.php";
                    fetch(url, {
                        method : 'POST',
                        headers : {
                            'Content-type' : 'application/json',
                            'Accept' : 'application/json'
                        },
                        body : JSON.stringify(values)
                    }).then((response) => response.json()).then((data) => getArtistID(data));
                }
            }
        }
    }

    var popularTracks = <div className = "container">
                            Popular Albums by { artistName }
                            <div className = "popularTracks">
                                { popularImages }
                            </div>
                        </div>

    var suggestions =   <div className = "newreleases" >
                            New Releases!!!
                            <div className = "albums">
                                { releases }
                            </div>
                        </div>

    return(
        <div>
            <img className = "background" src = "/Resources/Background.png" />
            <div className = "favourite">
                Favourite Artist
                <br/><br/>
                <img className = "artistImage" src = { artistImage } alt = "err" />
                <br/>
                { artistName }
                <br/><br/>
                <div className = "details">
                    Genre : { artistGenres }
                    <br/>
                    Followers : { artistFollowers }
                    <br/>
                    Popularity : { artistPopularity }%
                </div>
            </div>
            { artistName == "None" ? null : popularTracks }
            { artistName == "None" ? null : suggestions }
            <SideBar />
        </div>
    );
}

export default Statistics;