import { useState, useEffect } from "react";
import React from "react";
import { ReactDOM } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import './login.css'
import { CookiesProvider, useCookies } from "react-cookie";

function Login({setCookie2}) {

  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const [name, setName] = useState("")
  const [pw, setPw] = useState("")
  const navigate = useNavigate()
  const [err, setErr] = useState(null)

  useEffect(() => {
    if (cookies.user) {
      removeCookie("user")
    }
    setErr(null)
  }, [cookies]);

  function handleSubmit(e)
  {
    e.preventDefault()
    if(name === "" || pw === ""){
      setErr("noname")
      return;
    }
    axios.post('http://localhost:3001/login', {name, pw})
    .then(result => {
        if(result.data.status === "Success"){
          setCookie("user", result.data.id, { path: "/" })
          if(result.data.name !== ''){
            navigate("/home/welcome")
          }
        } else if(result.data.status === "Wrong Password"){
            setErr("wrongp")
        } else if(result.data.status === "No User Exists"){
            setErr("nousr")
        }})
    .catch(err => {
      console.error(err);
    })
  }

  function showError(){
    if(err === null){
        return null
    } else if(err === "wrongp"){
        return(
            <p>Wrong Password!</p>
        )
    } else if(err === "nousr"){
        return(
            <p>No User Found</p>
        )
    } else if(err === "noname"){
      return(
        <p>Username/password cannot be empty</p>
      )
    }
  }


  return (
    <div className="login-container">
      <div className="container">
    <h2>Login</h2>
    <form onSubmit={handleSubmit} className="input-container">
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPw(e.target.value)}
        value={pw}
      />
      {showError()}
      <input type="submit" value="Submit" className="link-button" />
    </form>
    <Link to="/register" className="link-button">
      New User? Register
    </Link>
  </div>
    </div>
  );
}

export default Login
