import React from 'react'
import {Link} from 'react-router-dom'
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Outlet } from 'react-router-dom';
import { useCookies } from "react-cookie";
import './home.css'

function Home(){

    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const navigate = useNavigate()

    function logOut(){
        removeCookie("user", { path: '/'});
        navigate("/login")
    }

    useEffect(() => {
        if (!cookies.user) {
          navigate("/login");
          return;
        }
        navigate("/home/welcome")
      }, [cookies]);


    return(
        <span className = "home-container">
            <span className = 'header'>
                <span className='link-container'>
                    <Link to="/home/welcome" className='header-link'>Home</Link>
                    <Link to="/home/profile" className='header-link'>Profile Page</Link>
                    <Link to="/home/friends" className='header-link'>Friends</Link>
                    <Link to="/home/chats" className='header-link'>Chats</Link>
                </span>
                <button onClick={logOut} className='logout-button'>Log Out</button>
            </span>
            <span className = "outlet">
                <>
                <Outlet></Outlet>
                </>
            </span>
        </span>
    ) 
}

export default Home