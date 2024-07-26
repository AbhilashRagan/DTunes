import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import { useState } from "react";

function SignIn()
{
    const [roll, setRoll] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error1, setError1] = useState("");
    const [error2, setError2] = useState("");
    const [error3, setError3] = useState("");

    const nav = useNavigate();

    function handleResponse(response)
    {
        if(response == "Account already exists")
        {
            window.location.reload();
        }
        else if(response == "Account created")
        {
            let url = "http://localhost:80/DTunes/backend/UserInfo.php";
            let values = {
                operation : "create",
                roll : roll
            };
            fetch(url, {
                method : 'POST',
                headers : {
                    'Accept' : 'application/json',
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify(values)
            });
            nav("/");
        }
    }

    function changeRoll(e)
    {
        let temproll = String(e.target.value);
        let valid = true;
        for(let i in temproll)
        {
            if(!(temproll[i].charCodeAt(0) <= 57 && temproll[i].charCodeAt(0) >= 48))
            {
                valid = false;
                break;
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

    function changeName(e)
    {
        let tempname = String(e.target.value);
        let valid = true;
        for(let i in tempname)
        {
            if(tempname[i] == "@" || tempname[i] == "#" || tempname[i] == "$" || tempname[i] == "%" || tempname[i] == "*" || tempname[i] == "!" || tempname[i] == "$" || tempname[i] == "-" || tempname[i] == "+" || tempname[i] == "=" || tempname[i] == "^")
            {
                valid = false;
                break;
            }
        }
        if(tempname.length == 0)
        {
            valid = true;
        }
        if(valid)
        {
            setError3("");
        }
        else
        {
            setError3("*Invalid name");
        }
        setName(e.target.value);
    }

    function handleClick()
    {
        if(error1 == "" && error2 == "" && error3 == "" && roll != "" && password != "" && name != "")
        {
            var url = "http://localhost:80/DTunes/backend/signin.php";
            var values = {
                roll : roll,
                name : name,
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
                <h1>Sign In</h1>
                <input type = "text" name = "roll" value = { roll } placeholder = "Enter roll number" onChange = { changeRoll } />
                <h1 className = "error">&emsp;&emsp;{ error1 }</h1>
                <input type = "password" name = "password" value = { password } placeholder = "Enter password" onChange = { changePassword } />
                <h1 className = "error">&emsp;&emsp;{ error2 }</h1>
                <input type = "text" name = "name" value = { name } placeholder = "Enter name" onChange = { changeName } />
                <h1 className = "error">&emsp;&emsp;{ error3 }</h1>
                <div className = "redirect">
                    <h1>Already have an account?<a href = "/" >Login</a></h1>
                </div>
                <br/>
                <input type = "submit" name = "signin" value = "Sign In" onClick = { handleClick } />
            </div>
        </div>
    );
}

export default SignIn;