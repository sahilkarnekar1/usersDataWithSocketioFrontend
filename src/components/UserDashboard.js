import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './UserDashboard.css'; // Import the CSS

const socket = io('https://user-data-with-socketio-backend.vercel.app/'); // Replace with your server's URL

const UserDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://user-data-with-socketio-backend.vercel.app/api/admin');
        setUsers(response.data.users || response.data); // Adjust depending on backend response structure
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

    // Listen for new user data from the backend via socket.io
    socket.on('newUser', (newUser) => {
      console.log('New user created:', newUser);
      // Add the new user to the existing list
      setUsers(prevUsers => [...prevUsers, newUser]);
    });

    // Cleanup the socket listener when the component unmounts
    return () => {
      socket.off('newUser');
    };
  }, []);

  return (
    <div className="user-dashboard">
      <h2>User Dashboard</h2>
      <div className="user-list">
        {users.map((user) => (
          <div key={user._id} className="user-card">
            <strong>{user.name}</strong>
            <div className="user-social-media">
              {user.socialMediaHandle.map((handle, index) => (
                <span key={index}>{handle.platform}: <a href={handle.link}>{handle.link}</a></span>
              ))}
            </div>
            <ul className="user-images">
              {user.images.map((image, index) => (
                <li key={index}>
                  <img
                    src={image}
                    alt={`User uploaded ${index}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
