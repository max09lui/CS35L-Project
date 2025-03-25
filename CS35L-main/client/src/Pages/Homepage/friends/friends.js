import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import "./friends.css"

function Friends() {
  const [myFriends, setMyFriends] = useState([]);
  const [newFriendName, setNewFriendName] = useState('');
  const [cookies, setCookie] = useCookies(["user"]);

  const [friendRequests, setFriendRequests] = useState([]);
  const [showFriendRequests, setShowFriendRequests] = useState(false);

  const [sentRequests, setSentRequests] = useState([]);
  const [showSentRequests, setShowSentRequests] = useState(false);

  const [err, setErr] = useState(null); 

  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedFriendForDeny, setSelectedFriendForDeny] = useState(null);

  function showError(){
    if(err === null){
      return null
    } else if(err === "self"){
      return(<p className='error'>Can't add yourself!</p>)
    } else if(err === "already"){
      return(<p className='error'>Already friends!</p>)
    } else if(err === "DNE"){
      return(<p className='error'>User doesn't exist.</p>)
    } else if(err === "sent"){
      return(<p className='success'>Sent!</p>)
    } else if(err === "pending"){
      return(<p className='error'>Request already sent.</p>)
    }
  }

  async function acceptRequest(otherName) {
    const friender = cookies.user;
  
    try {
      const response = await axios.get(`http://localhost:3001/getUserId?name=${otherName}`);
      const recipient = response.data.id;
      try {
        await axios.put('http://localhost:3001/acceptFriendRequest', {
          friender,
          recipient
        });
      } catch (error) {
        console.error('Error accepting friend:', error);
      }
    } catch (error) {
      console.error('Error getting recipient id:', error.response.data.message);
    }
    getSentRequests();
    getIncomingRequests();
    getFriends();
  }


  async function denyRequest(otherName) {
    const person1 = cookies.user;
  
    try {
      const response = await axios.get(`http://localhost:3001/getUserId?name=${otherName}`);
      const person2 = response.data.id;
  
      try {
        const response = await axios.delete('http://localhost:3001/deleteFriend', {
          data: { person1, person2 },
        });
      } catch (error) {
        console.error('Error denying request:', error);
      }
    } catch (error) {
      console.error('Error getting recipient id:', error.response.data.message);
    }
    getSentRequests();
    getIncomingRequests();
    getFriends();
  }



  async function addFriend(newFriendName) {
    if(newFriendName === ""){
      setErr("DNE")
      return;
    }
    const friender = cookies.user;
  
    try {
      const response = await axios.get(`http://localhost:3001/getUserId?name=${newFriendName}`);
  
      const recipient = response.data.id;

      if(recipient === friender){
        setErr("self")
        return;
      }
      if (myFriends.includes(newFriendName)) {
        setErr("already")
        return;
      }
      if (sentRequests.includes(newFriendName)){
        setErr("pending")
        return;
      }
      setErr(null)
  
      try {
        const addFriendResponse = await axios.post('http://localhost:3001/sendFriendRequest', {
          friender,
          recipient
        });

        setErr("sent")
      } catch (error) {
        console.error('Error adding friend:', error.response.data.message);
      }
    } catch (error) {
      console.error('Error getting recipient id:', error.response.data.message);
      setErr("DNE")
    }
    setNewFriendName('');
    getSentRequests();
  }

  const getSentRequests = async () => {
    const user = cookies.user;
    try {
      const getSentRequestsData = await axios.get(`http://localhost:3001/getOutgoingFriendRequests/${user}`);
      const friendRequests = getSentRequestsData.data.friendRequests;

      // Iterate over each dictionary and get user data
      const userDataPromises = friendRequests.map(async (request) => {
        const userDataResponse = await axios.get(`http://localhost:3001/getUserData`, {
          params: { _id: request.recipient },
        });
        return userDataResponse.data;
      });

      // Wait for all promises to resolve
      const userDataArray = await Promise.all(userDataPromises);

      const userNames = userDataArray.map((data) => data.name)

      // Update state with the collected user data
      setSentRequests(userNames);

    } catch (error) {
      console.error('Error getting sent requests:', error.response ? error.response.data.message : error.message);
    }
  };

  const getIncomingRequests = async () => {
    const user = cookies.user;
    try {
      const response = await axios.get(`http://localhost:3001/getIncomingFriendRequests/${user}`);
      const friendRequests = response.data.friendRequests;

      // Iterate over each dictionary and get user data
      const userDataPromises = friendRequests.map(async (request) => {
        const userDataResponse = await axios.get(`http://localhost:3001/getUserData`, {
          params: { _id: request.friender },
        });
        return userDataResponse.data;
      });

      // Wait for all promises to resolve
      const userDataArray = await Promise.all(userDataPromises);

      const userNames = userDataArray.map((data) => data.name)

      // Update state with the collected user data
      setFriendRequests(userNames);

    } catch (error) {
      console.error('Error getting incoming requests:', error.response ? error.response.data.message : error.message);
    }
  };

  const openConfirmationModal = (friend) => {
    setSelectedFriendForDeny(friend);
    setConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setSelectedFriendForDeny(null);
    setConfirmationModal(false);
  };

  const confirmDenyRequest = () => {
    if (selectedFriendForDeny) {
      denyRequest(selectedFriendForDeny);
      closeConfirmationModal();
    }
  };




  useEffect(() => {
    if (showSentRequests) {
      getSentRequests();
    }
  }, [showSentRequests]);

  useEffect(() => {
    if (showFriendRequests) {
      getIncomingRequests();
    }
  }, [showFriendRequests]);

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
      setMyFriends(userNames);
    } catch (error) {
      console.error('Error getting incoming requests:', error.response ? error.response.data.message : error.message);
    }
  }

  useEffect(()=>{
    getFriends();
  }, [])




  return (
    <div id="friends-container">
      <div>
        <h2>Friends:</h2>
        <ul>
          {myFriends.map((friend, index) => (
            <div className='friend-listing' key={index}>
              <button className='close-button' onClick={() => openConfirmationModal(friend)} ></button>
              <Link className='friend-link' to={`/home/friends/${encodeURIComponent(JSON.stringify(friend))}`}>
                {friend}
              </Link>
            </div>
          ))}
        </ul>
        
        {/* Confirmation Modal */}
        {confirmationModal && (
          <div className="modal-overlay" onClick={() => setConfirmationModal(false)}>
            <div className="modal-container">
              <p>Are you sure you want to remove {selectedFriendForDeny} as a friend?</p>
              <button className='blue-button confirm-button' onClick={confirmDenyRequest}>Yes</button>
              <button className='blue-button' onClick={closeConfirmationModal}>No</button>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ marginRight: '8px' }}>Add Friend:</p>
          <input
            type="text"
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
            style={{ marginRight: '8px' }}
          />
          <button className='blue-button' onClick={() => addFriend(newFriendName)}>Add</button>
          {showError()}
        </div>
        {/* Friend Requests Modal */}
        {showFriendRequests && (
          <div className="friend-requests-modal">
            <h2>Friend Requests</h2>
            <ul>
              {friendRequests.map((request, index) => (
                <li key={index}>
                  {request + ' '}
                  <button className='blue-button' onClick={() => acceptRequest(request)}>Accept</button>
                  <button className='blue-button' onClick={() => denyRequest(request)}>Deny</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button className='blue-button' onClick={() => setShowFriendRequests(prevState => !prevState)}>
          {showFriendRequests ? "Close" : "View Friend Requests"}
        </button>
        <br/>
        <br/>
        {showSentRequests && (
          <div className="friend-requests-modal">
            <h2>Sent Requests</h2>
            <ul>
              {sentRequests.map((request, index) => (
                <li key={index}>
                  {request + ' '}
                  <button className='blue-button' onClick={() => denyRequest(request)}>Cancel</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button className='blue-button' onClick={() => setShowSentRequests(prevState => !prevState)}>
          {showSentRequests ? "Close" : "View Pending Requests"}
        </button>
      </div>
      <div id = "side-profile">
      <Outlet />
      </div>
    </div>
  );
}

export default Friends;

