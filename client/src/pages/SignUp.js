import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import NavigationBar from "../components/NavigationBar";

export default function SignUp() {

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate();


    const [loaded, setLoaded] = useState(false);

    useEffect(() => {

        // Check if the user is logged in
        fetch("/api/v1/me", {
            credentials: "include"
        }).then(res => {
            if (res.ok) {
                navigate("/profile")
            }
        }).then(_ => {
            setLoaded(true)
        })
    }, [])

    async function handleSignUp() {
        console.log("Function called once")

        // Empty out the error first
        setError("")

        if (confirmPassword != password) {
            setError("Password does not match!")
        } else {
            fetch("/api/v1/auth/app/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    username: username,
                    password: password
                })
            }).then(res => {
                if (!res.ok) {
                    throw res
                } else {
                    return res.json()
                }
            }).then(data => {

                localStorage.setItem("profile_pic_url", data.profile_pic_url)
                navigate("/profile")

            })
                .catch(err => {
                    if (err.status == 409) {
                        setError("User already exists!")
                    } else if (err.status == 400) {
                        setError("Usernames can only contain lowercase letters, underscores, periods and numbers");
                    } else {
                        setError("Something went wrong")
                    }
                })
        }

    }

    function handleSubmit(e) {
        e.preventDefault();
        handleSignUp();
    }

    return (
        <div>

            <NavigationBar />

            {loaded && (
                <>
                    <div className="jumbotron my-10 flex flex-col items-center">
                        <h1>
                            Sign Up
                        </h1>
                    </div>

                    <p className="text-lg text-center">
                        Sign up to create an account
                    </p>

                    <div className="container">


                        <p className="error mt-10">
                            {error}
                        </p>

                        <form onSubmit={handleSubmit}>


                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" required placeholder="Email" className="block w-full" onChange={e => setEmail(e.target.value)} />

                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" required placeholder="Username" className="block w-full" onChange={e => setUsername(e.target.value)} />

                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" required placeholder="Enter your password" className="block w-full" onChange={e => setPassword(e.target.value)} />

                            <label htmlFor="confirm-password">Confirm Password</label>
                            <input type="password" id="confirm-password" required placeholder="Re-enter your password" className="block w-full" onChange={e => setConfirmPassword(e.target.value)} />

                            <p className="text-center text-sm text-black/50">
                                By Signing up, you agree to <a className="underline " href="/privacy-policy">
                                    Musicn's Privacy Policy
                                </a>
                            </p>

                            <button
                                className="btn my-6">
                                Sign Up
                            </button>
                        </form>

                        <p className="text-center">Have an account? <a href="/login" className="underline">Login</a></p>
                    </div>
                </>
            )}

        </div>
    )
}
