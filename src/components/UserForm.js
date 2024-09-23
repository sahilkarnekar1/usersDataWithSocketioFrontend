import React, { useState } from 'react';
import axios from 'axios';
import './UserForm.css'; // Import the CSS file

const UserForm = () => {
  const [name, setName] = useState('');
  const [socialMediaHandles, setSocialMediaHandles] = useState([{ platform: '', link: '' }]);
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSocialMediaChange = (index, field, value) => {
    const updatedHandles = [...socialMediaHandles];
    updatedHandles[index][field] = value;
    setSocialMediaHandles(updatedHandles);
  };

  const addSocialMediaField = () => {
    setSocialMediaHandles([...socialMediaHandles, { platform: '', link: '' }]);
  };

  const removeSocialMediaField = (index) => {
    const updatedHandles = socialMediaHandles.filter((_, i) => i !== index);
    setSocialMediaHandles(updatedHandles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('socialMediaHandle', JSON.stringify(socialMediaHandles));  // Send social media handle as JSON

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      await axios.post('https://user-data-with-socketio-backend.vercel.app/api/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setName('');
      setSocialMediaHandles([{ platform: '', link: '' }]); // Reset social media handles
      setImages([]);
      alert('User added successfully!');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          className="form-input"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Render dynamic social media handles */}
      {socialMediaHandles.map((handle, index) => (
        <div key={index} className="form-group social-media-group">
          <label>Social Media:</label>
          <input
            type="text"
            className="form-input"
            placeholder="Platform (e.g., Twitter)"
            value={handle.platform}
            onChange={(e) => handleSocialMediaChange(index, 'platform', e.target.value)}
            required
          />
          <input
            type="text"
            className="form-input"
            placeholder="Link (e.g., https://twitter.com/yourhandle)"
            value={handle.link}
            onChange={(e) => handleSocialMediaChange(index, 'link', e.target.value)}
            required
          />
          {socialMediaHandles.length > 1 && (
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeSocialMediaField(index)}
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <button type="button" className="add-btn" onClick={addSocialMediaField}>
        Add Another Social Media
      </button>

      <div className="form-group">
        <label>Upload Images:</label>
        <input
          type="file"
          className="form-input"
          multiple
          onChange={handleImageChange}
          required
        />
      </div>

      <button type="submit" className="submit-btn">Submit</button>
    </form>
  );
};

export default UserForm;
