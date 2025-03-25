import React, { useState, useEffect, useRef, useLayoutEffect} from "react";
import { useParams } from "react-router-dom";
import './conversation.css'
import Message from "./message";
import { CookiesProvider, useCookies } from "react-cookie";


import axios from 'axios';

function Conversation(){

  const [cookies, setCookie] = useCookies(["user"]);
  const { friendList } = useParams();
  const decodedFriendList = JSON.parse(decodeURIComponent(friendList));
  const user = cookies.user
  const messagesColumnRef = useRef(null);
  const [message, setMessage] = useState()
  const [convo, changeConvo] = useState([])



  useEffect(() => {
    getConversation();
    const conversationInterval = setInterval(getConversation, 3000); // Run every 3 seconds
    messagesColumnRef.current.scrollTop = messagesColumnRef.current.scrollHeight;

    return () => {
      clearInterval(conversationInterval); // Clear the interval when the component is unmounted
    };
  }, [friendList]);



  async function handleSendMessage() {
    const senderId = cookies.user;
  
    try {
      const response = await axios.get(`http://localhost:3001/getUserId?name=${decodedFriendList[0]}`);
  
      const receiverId = response.data.id;
      const text = message;
  
      try {
        const sendMessageResponse = await axios.post('http://localhost:3001/sendMessage', {
          senderId,
          receiverId,
          text,
        });
  
      } catch (error) {
        console.error('Error sending message:', error.response.data.message);
      }
      setMessage("");
      getConversation();
    } catch (error) {
      console.error('Error getting receiverId:', error.response.data.message);
    }
  }

  const getConversation = async () => {
    console.log("Fetching conversation...")
    const senderId = cookies.user;
    try {
      const response = await axios.get(`http://localhost:3001/getUserId?name=${decodedFriendList[0]}`);
      const receiverId = response.data.id;
      if(receiverId === cookies.user){
        changeConvo([])
      return;
      }
  
      try {
        const response = await axios.get(`http://localhost:3001/getConversation/${senderId}/${receiverId}`);
        changeConvo(response.data.data)
      } catch (error) {
        console.error('Error retrieving conversation:', error.response ? error.response.data : error.message);
        changeConvo([])
      }
    } catch (error) {
      console.error('Error getting receiverId:', error.response.data.message);
      changeConvo([])
    }
  };


  return (
    <>
      <h3>Conversation with {decodedFriendList.join(', ')}:</h3>
      <div id="conversation">
        <div id = "conversationMessages" ref = {messagesColumnRef}>
          {convo.map((dict, index) => {
            const showName = ((index > 0) && (convo[index-1].sender === dict.sender))
            return (
                <Message text={dict.text} side={dict.sender === user ? 'right' : 'left'} first = {!showName} user = {dict.sender}/>
            );
          })}
        </div>
        <input onChange={(e) => setMessage(e.target.value)} value = {message}></input>
        <button className="blue-button" onClick={handleSendMessage}>Send</button>
      </div>
    </>
  );
  };

export default Conversation