import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FaPause, FaPlay, FaSpotify } from "react-icons/fa"
import NavigationBar from "../components/NavigationBar";

export default function User() {

    const params = useParams();
    const app_userid = params.id;
    const [user, setUser] = useState({})
    const [currentSong, setCurrentSong] = useState(null)
    const [topSongs, setTopSongs] = useState(null)
    const navigate = useNavigate() 


    useEffect(() => {
        (async () => {
            let profile = await getUserProfile();
            setUser(profile)

            let currently_playing = await getUserCurrentlyPlaying();
            setCurrentSong(currently_playing)

            let top_tracks = await getUserTopSongs();
            setTopSongs(top_tracks)
        })();

    }, [])

    async function getUserProfile() {
        return fetch(`/api/user/${app_userid}`)
            .then(res => res.json())
            .then(user => {
                if(!user.refresh_token) navigate("/users")
                return user
            }).catch(err => {
                navigate("/users")
            })
    }

    async function getUserCurrentlyPlaying() {
        return fetch(`/api/songs/${app_userid}/currently_playing`)
            .then(res => res.json())
            .then(currentSong => {
                if (currentSong.error) {
                    return null
                }
                return currentSong
            }).catch(error => {
                setCurrentSong(-1)
            })
    }

    async function getUserTopSongs() {
        return fetch(`/api/songs/${app_userid}/top_songs`)
            .then(res => res.json())
            .then(topSongs => {
                return topSongs.items
            })
    }

    return (
        <div>

            <NavigationBar />

            <div className="jumbotron my-10 flex flex-col items-center">

                <img src={user.profile_pic_url} className="profile_picture rounded-full w-24 h-24" />

                <h2 className="text-3xl font-bold">{user && user.name}</h2>
                <p className="text-sm text-black/50" id="follower-count-text">
                    @{user.username}
                </p>


                <a id="spotify-profile-link"
                    href={"https://open.spotify.com/user/" + user.spotify_userid}
                    className="flex mt-6 justify-center items-center px-3 py-2 bg-spotify-green text-white rounded-lg hover:shadow-md hover:shadow-spotify-green/50 transition ease-out duration-500">
                    <FaSpotify className="fa fa-spotify text-1xl text-center text-white mr-2" aria-hidden="true"></FaSpotify>
                    Spotify
                </a>
            </div>

            <div className="currently-listening my-20">
                <h5 className="text-center font-bold text-lg my-2 text-black/50">I'm currently listening to</h5>

                {/* <p>{JSON.stringify(currentSong)}</p> */}

                <a id="currently-listening-data-url" href={currentSong ? currentSong.item.external_urls.spotify : ""}>

                    {currentSong ? (
                        <>
                            <div id="currently-listening-song"
                                className={"flex bg-white border w-fit m-auto transition ease-out items-center hover:drop-shadow-lg"}>

                                <img src={currentSong.item.album.images[0].url} className="h-14" />


                                <div className="mx-4">
                                    <p className="font-bold">{currentSong.item.name}</p>
                                    <p className="text-black/50 text-sm">{currentSong.item.artists[0].name}</p>
                                </div>

                            </div>

                        </>
                    ) : (
                        <div id="currently-listening-song"
                            className="flex bg-white border w-fit lg m-auto items-center btn-anim">
                            <p className='p-4 text-black/50 italic'>I'm not listening to anything right now</p>
                        </div>
                    )}

                </a>

            </div>


            {topSongs && (
                <>

                    <h4 className="text-center font-bold my-4">Top songs of the month</h4>
                    <div id="top-tracks" className="flex flex-wrap items-stretch">
                        {topSongs.map((
                            {
                                name,
                                artists,
                                external_urls: { spotify: url },
                                album: { images: [bigImage] }
                            }, index
                        ) => (<div key={index} className="lg:w-1/5 w-1/2 md:w-1/3">


                            <div className="bg-white">


                                <img src={bigImage.url} className="w-fit h-auto" />

                                <div className="py-7">


                                    <h1 className="text-black text-center font-bold">{name}</h1>
                                    <p className="text-black/50 text-sm text-center">{artists.map(a => a.name).join(", ")}</p>

                                    <a id="spotify-profile-link"
                                        href={url}
                                        className="flex mt-4 mx-auto w-fit justify-center items-center px-3 py-2 bg-spotify-green text-white rounded-lg hover:shadow-md hover:shadow-spotify-green/50 transition ease-out duration-500">
                                        <FaSpotify className="fa fa-spotify text-1xl text-center text-white mr-2" aria-hidden="true"></FaSpotify>
                                        Spotify
                                    </a>

                                </div>

                            </div>


                        </div>))}



                    </div>
                </>
            )}
        </div>
    )
}
