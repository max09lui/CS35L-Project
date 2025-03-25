import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";

function Welcome(){

    const [cookies, setCookie] = useCookies(["user"]);
    const [name, setName] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        const handleFetchData = async () => {
            try {
                const searchId = cookies.user;
            
                const response = await axios.get(`http://localhost:3001/getUserData?_id=${searchId}`);
                /*Query is passed as a dictionary. Names used determine the keys for the dictionary
                To have multiple: ?_id=${searchId}&param1=${queryParam1}&param2=${queryParam2} */
                //setCount(response.data.count)
                setName(response.data.name)
            } catch (error) {
                console.log(error);
            }
          };
    
        handleFetchData();
      }, []);

    return(
        <>
        {name === '' ?
        <div className="loader-container">
            <div className="spinner"></div>
        </div>
        :
        <>
            <h2>Hello, {name}!</h2>
            <p>This is our messaging app. Visit your profile or your list of friends from the links above</p>
        </>
        }
        </>
    )
}

export default Welcome