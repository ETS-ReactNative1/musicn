import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { FaExclamationTriangle, FaSpotify } from "react-icons/fa"
import NavigationBar from "../components/NavigationBar";
import Cookies from "universal-cookie";
const cookie = new Cookies();

export default function Profile() {

    const [user, setUser] = useState({})
    const [error, setError] = useState("")
    let navigate = useNavigate();

    const [username, setUsername] = useState("");

    useEffect(() => {
        if (document.cookie.length == 0) {
            window.location.href = "/login";
        }
        (async () => {
            let profile = await getUserProfile();
            setUser(profile[0])
            setUsername(profile[0].username)
        })();

    }, [])

    async function getUserProfile() {
        setError("")
        return fetch(`/api/me`, {
            credentials: "include"
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    throw res
                }
            })
            .then(user => {
                console.log(user)
                return user
            }).catch(err => {
                setError("Something went wrong while fetching your profile")
            })
    }

    async function handleChangeUsername() {
        fetch(`/api/me`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username
            })
        }).then(res => {
            if (res.ok) {
                return res.json()
            } else {
                throw res
            }
        })
            .then(user => {
                navigate("/user/" + username)
            }).catch(err => {
                if (err.status == 409) {
                    setError("Username already exists")
                } else {
                    setError("Something went wrong while updating your profile")
                }
                console.log(err)
            })
    }

    function handleLogout() {
        fetch("/api/auth/app/logout")
            .then(res => res.json())
            .then(data => {
                navigate("/")
            })
    }

    return (
        <div>

            <NavigationBar />

            <div className="my-10 flex flex-col items-center">

                <img src={user.profile_pic_url} className="profile_picture rounded-full w-24 h-24" />

                <h2 className="text-3xl font-bold">{user && user.name}</h2>
                <p className="text-sm text-black/50" id="follower-count-text">
                    @{user.username}
                </p>

                <Link to={"/user/" + user.username} id="spotify-profile-link"
                    href={"https://open.spotify.com/user/" + user.spotify_userid}
                    className="flex mx-auto mt-6 justify-center items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:shadow-md hover:shadow-blue-500 transition ease-out duration-500">
                    Go to profile page
                </Link>

                {!user.refresh_token && (

                    <div className="mt-6 flex-col md:flex-row bg-white border border-black/20 drop-shadow-lg p-10 rounded-2xl w-2/3">
                        <FaExclamationTriangle className="text-red-500 text-4xl" />

                        <div className="mt-2">

                            <p className="font-bold text-2xl text-left">
                                Link your Spotify Account
                            </p>

                            <p className="text-left text-black/50">
                                Your friends won’t be able to see your Spotify statistics unless you link your Spotify account!
                            </p>

                            <a id="spotify-profile-link"
                                href="http://localhost:4000/api/auth"
                                className="flex mt-5 justify-center items-center px-3 py-2 bg-spotify-green text-white rounded-lg hover:shadow-md hover:shadow-spotify-green/50 transition ease-out duration-500">
                                <FaSpotify className="fa fa-spotify text-1xl text-center text-white mr-2" aria-hidden="true"></FaSpotify>
                                Link your Spotify
                            </a>
                        </div>

                    </div>
                )}



            </div>

            <div className="container">


                <p className="text-red-500 text-center">
                    {error}
                </p>

                <h1 className="text-center text-2xl font-bold">
                    Edit Profile
                </h1>

                <label htmlFor="username">
                    Username
                </label>

                <input type="text" required id="username" placeholder="Username" value={username} className="block w-full" onChange={e => setUsername(e.target.value)} />

                {username != user.username && <button className="border rounded-lg w-full text-center bg-brand-color py-3" onClick={() => {
                    handleChangeUsername()
                }}>
                    Save Username</button>}

                <button onClick={handleLogout} id="spotify-profile-link"
                    href={"https://open.spotify.com/user/" + user.spotify_userid}
                    className="flex mx-auto mt-6 justify-center items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:shadow-md hover:shadow-red-500 transition ease-out duration-500">
                    Log Out
                </button>
            </div>


        </div>
    )
}
