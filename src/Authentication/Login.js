import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login()
{
    const [roll, setRoll] = useState("");
    const [password, setPassword] = useState("");
    const [error1, setError1] = useState("");
    const [error2, setError2] = useState("");

    const nav = useNavigate();

    function changeRoll(e)
    {
        let temproll = String(e.target.value);
        let valid = true;
        for(let i in temproll)
        {
            if(!(temproll[i].charCodeAt(0) <= 57 && temproll[i].charCodeAt(0) >= 48))
            {
                valid = false;
            }
        }
        if(temproll.length != 9)
        {
            valid = false;
        }
        if(temproll.length == 0)
        {
            valid = true;
        }
        if(valid)
        {
            setError1("");
        }
        else
        {
            setError1("*Invalid roll number");
        }
        setRoll(e.target.value);
    }

    function changePassword(e)
    {
        if(String(e.target.value).length < 8 && String(e.target.value).length != 0)
        {
            setError2("*Password should have more than 8 characters");
        }
        else
        {
            setError2("");
        }
        setPassword(e.target.value);
    }

    function handleResponse(response)
    {
        if(response == "You don't have an account")
        {
            alert(response);
            window.location.reload();
        }
        else
        {
            alert("Welcome");
            window.sessionStorage.setItem("roll", roll);
            nav("/home");
        }
    }

    function handleClick(e)
    {
        if(roll != "" && password != "" && error1 == "" && error2 == "")
        {
            var url = "http://localhost:80/DTunes/backend/login.php";
            var values = {
                roll : roll,
                password : password
            };
            fetch(url, {
                method : 'POST',
                headers : {
                    'Accept' : 'application/json',
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify(values)
            }).then((response) => response.json()).then((data) => { handleResponse(data) });
        }
        else
        {
            alert("Invalid fields");
        }
    }

    return(
        <div>
            <img className = "background" src = "/Resources/Background.png" alt = "err" />
            <div className = "contents">
                <h1>Login</h1>
                <input type = "text" name = "roll" value = { roll } placeholder = "Enter roll number" onChange = { changeRoll } />
                <h1 className = "error">&emsp;&emsp;{ error1 }</h1>
                <input type = "password" name = "password" value = { password } placeholder = "Enter password" onChange = { changePassword } />
                <h1 className = "error">&emsp;&emsp;{ error2 }</h1>
                <br/>
                <div className = "redirect">
                    <h1>Don't have an account?<a href = "/signin" >Sign In</a></h1>
                </div>
                <br/>
                <input type = "submit" name = "login" value = "Login" onClick = { handleClick } />
            </div>
        </div>
    );
}

export default Login;