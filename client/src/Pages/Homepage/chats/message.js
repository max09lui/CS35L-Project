import React from "react";
import './message.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

function Message({side, text, first, user}){

    const [name, changeName] = useState("")

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await axios.get(`http://localhost:3001/getUserData?_id=${user}`);
            changeName(response.data.name);
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchUserData();
      }, [user]);

    return(
        <div className = {`msgContainer ${side}`}>
            {first ? <div className={`${side} name${side}`}>{name}</div> : null}
            <div className={`message message${side}`}>
                {text}
            </div>
        </div>
    )
}

export default Message