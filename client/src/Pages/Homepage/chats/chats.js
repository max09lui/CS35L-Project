import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './chats.css'
import { useCookies } from 'react-cookie';
import axios from 'axios';

function Chats() {
  const [cookies, setCookie] = useCookies(["user"]);
  const [myChats, setMyChats] = useState([["isaacpinto1"], ["red"], ["pauleggert"]]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [friends, setFriends] = useState([])

  const getFriends = async () => {
    const user = cookies.user;
    try {
      const response = await axios.get(`http://localhost:3001/getFriendsList/${user}`);
      const friendRequests = response.data.friends;

      // Iterate over each dictionary and get user data
      const userDataPromises = friendRequests.map(async (request) => {
        const friendId = request.friender === cookies.user ? request.recipient : request.friender;
        const userDataResponse = await axios.get(`http://localhost:3001/getUserData`, {
          params: { _id: friendId },
        });
        return userDataResponse.data;
      });

      // Wait for all promises to resolve
      const userDataArray = await Promise.all(userDataPromises);

      const userNames = userDataArray.map((data) => data.name)

      // Update state with the collected user data
      const friends = userNames.map((data) => [data])
      setFriends(friends);
    } catch (error) {
      console.error('Error getting incoming requests:', error.response ? error.response.data.message : error.message);
    }
  }

  useEffect(()=>{
    getFriends();
  }, [])

  const handleNewChat = () => {
    // Open the modal to select friends
    setShowModal(true);
  };

  const handleFriendSelection = (friend) => {
    if (selectedFriends.includes(friend)) {
      setSelectedFriends((prevSelected) =>
        prevSelected.filter((selected) => selected !== friend)
      );
    } else {
      setSelectedFriends((prevSelected) => [...prevSelected, friend]);
    }
  };

  const isDuplicateChat = () => {
    // Check if the sorted order of selectedFriends is already in myChats
    const sortedSelectedFriends = [...selectedFriends].sort();
    return myChats.some((chat) => {
      const sortedChat = [...chat].sort();
      return JSON.stringify(sortedChat) === JSON.stringify(sortedSelectedFriends);
    });
  };

  const handleCreateChat = () => {
    // Check for duplicates
    if (isDuplicateChat()) {
        alert('Chat already exists!');
        setShowModal(false);
    } else{
        setMyChats((prevChats) => [...prevChats, selectedFriends]);
    }
    setShowModal(false);
    setSelectedFriends([]);
  };

  return (
    <>
      <h2>Chats:</h2>
      <ul>
        {friends.map((friendList, index) => (
          <React.Fragment key={index}>
            <Link className='friend-linkc' to={`/home/chats/${encodeURIComponent(JSON.stringify(friendList))}`}>
              {friendList.join(', ')}
            </Link>
            <br />
          </React.Fragment>
        ))}
      </ul>
      <br/>
      {/*
      Code to create groupchats:

      <button onClick={handleNewChat}>New Chat</button>
      {showModal && (
        <>
          <div className="overlay" onClick={() => setShowModal(false)}></div>
          <div className="modal-container">
            <h3>Select Friend(s) for New Chat:</h3>
            <ul className='friend-list'>
              {friends.map((friend, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFriends.includes(friend)}
                      onChange={() => handleFriendSelection(friend)}
                    />
                    {" " + friend}
                  </label>
                </li>
              ))}
            </ul>
            <button onClick={handleCreateChat}>Create Chat</button>
          </div>
        </>
      )}*/}
      <Outlet />
    </>
  );
}

export default Chats;