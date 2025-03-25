import { useState, useEffect } from "react";
import React from "react";
import { ReactDOM } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";
import "./register.css"


function Register() {

  const [name, setName] = useState("")
  const [pw, setPw] = useState("")
  const [bio, setBio] = useState("")
  const [color, setColor] = useState("")
  const navigate = useNavigate()
  const [err, setErr] = useState(null); 
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  useEffect(() => {
    if (cookies.user) {
      removeCookie("user")
    }
    setErr(null)
  }, [cookies]);


  function handleSubmit(e){
    e.preventDefault()
    if(name === "" || pw === ""){
      setErr("noname")
      return;
    }
    axios.post('http://localhost:3001/register', {name, pw, color, bio})
    .then(result => {
      if(result.data.status === "Success"){
        navigate("/login")
      } else{
        setErr("409") // 409: user already exists
      }
    })
    .catch(err => {console.log(err)
     if(err.message === "Network Error"){
      setErr("123")
     } 
    })
  
  }

  function showError(){
    if(err === null){
      return null
    } else if(err === "409"){
      return(<p>Username is taken</p>)
    } else if(err === "123"){
      return(<p>Error connecting to server</p>)
    } else if(err === "noname"){
      return(<p>Username/password cannot be empty</p>)
    }
  }


  return (
    <div>
      <div className='login-container'>
        <div className="container">
          <h2>Register</h2>
          <form onSubmit={handleSubmit} className="input-container">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              placeholder="Username"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <br />
            <label htmlFor="pw">Password:</label>
            <input
              type="password"
              id="pw"
              placeholder="Password"
              onChange={(e) => setPw(e.target.value)}
              value={pw}
            />
            <br />
            {showError()}
            <input type="submit" value="Register" className="link-button" />
          </form>
          <Link to="/login" className="link-button">
            Already have an Account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
