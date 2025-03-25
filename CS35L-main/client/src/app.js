import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './Pages/login/login.js';
import Home from './Pages/Homepage/home/home';
import Register from "./Pages/register";
import Profile from "./Pages/Homepage/profile/profile";
import Welcome from "./Pages/Homepage/welcome";
import Friends from "./Pages/Homepage/friends/friends";
import Conversation from "./Pages/Homepage/chats/conversation";
import { useState } from "react";
import { CookiesProvider, useCookies } from "react-cookie";
import Chats from "./Pages/Homepage/chats/chats.js";

function App(){

    const [cookies, setCookie] = useCookies(["user"]);
    
    return(
        <BrowserRouter>
            <Routes>
                <Route path = '/register' element={<Register/>}></Route>
                
                <Route path = '/login' element={<Login/>}></Route>

                <Route path = '/home' element = {<Home/>}>
                    <Route path = "welcome" element = {<Welcome />}></Route>
                    <Route path = "profile" element = {<Profile />}></Route>
                    <Route path = "friends" element = {<Friends/>}>
                        <Route path="/home/friends/:friend" element={<Profile/>}/>
                    </Route>
                    <Route path = "chats" element = {<Chats/>}>
                        <Route path="/home/chats/:friendList" element={<Conversation/>}/>
                    </Route>
                </Route>
                <Route path = "*" element={cookies.user? <Navigate to = "/home/welcome"/>: <Navigate to = "/login"/> }></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App