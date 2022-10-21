import React from 'react';
import { useAppDispatch } from 'hooks/reduxHooks';
import { clear } from 'slices/authSlice';
import { TokenResponse } from 'types';

const Profile = ({ auth }: { auth: TokenResponse }) => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(clear());
  };

  return (
    <div>
      <h3>Profile</h3>
      <div>Username: {auth.user.username}</div>
      <div>Email: {auth.user.email}</div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
