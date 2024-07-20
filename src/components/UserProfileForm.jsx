import React, { useState } from 'react';
import { updateUserProfile } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const UserProfileForm = ({ user, setIsEditing, setError }) => {
  const [userForm, setUserForm] = useState({
    full_name: user.full_name || '',
    email: user.email || '',
    username: user.username || '',
    password: ''
  });
  const { updateUserInfo } = useAuth();

  console.log(user.id)

  const handleChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const dataToUpdate = {
        full_name: userForm.full_name,
        email: userForm.email,
        username: userForm.username
      };

      if (userForm.password) {
        dataToUpdate.password = userForm.password;
      }

      const updatedUser = await updateUserProfile(dataToUpdate, user.id);
      updateUserInfo();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Nom complet</label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          value={userForm.full_name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={userForm.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
        <input
          type="text"
          id="username"
          name="username"
          value={userForm.username}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Nouveau mot de passe (laisser vide si inchangé)</label>
        <input
          type="password"
          id="password"
          name="password"
          value={userForm.password}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
        />
      </div>
      <button type="submit" className="w-full bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors">
        Sauvegarder les modifications
      </button>
    </form>
  );
};

export default UserProfileForm;