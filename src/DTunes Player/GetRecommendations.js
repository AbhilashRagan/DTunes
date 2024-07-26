import axios from "axios";

async function GetRecommendations(token, seed_artists, seed_tracks)
{
    let recommendations = [seed_tracks];
    let url = "https://api.spotify.com/v1/recommendations";
    const {data} = await axios.get(url, {
        headers : {
            Authorization : `Bearer ${ token }` 
        },
        params : {
            limit : 10,
            seed_artists : seed_artists,
            seed_tracks : seed_tracks
        }
    });
    for(let i in data["tracks"])
    {
        recommendations.push(data["tracks"][i]["id"]);
    }
    return recommendations;
}

export default GetRecommendations;