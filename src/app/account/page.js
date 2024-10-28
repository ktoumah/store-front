"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { endpoints } from "@/config/endpoints";
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';

const AccountPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [editing, setEditing] = useState(false);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      router.push('/login');
    } else {
      setToken(savedToken);
      fetchUserInfo(savedToken);
    }
  }, [router]);

  const fetchUserInfo = async (token) => {
    try {
      const response = await axios.get(endpoints.users.getAccount, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo({ ...response.data.data });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        router.push('/login');
      }
    }
  };

  const handleEdit = async () => {
    if (!userInfo) return;
    try {
      await axios.put(endpoints.users.updateAccount(userInfo.id), userInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditing(false);
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  if (!userInfo) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {editing ? (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Email"
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            variant="outlined"
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleEdit}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="h4" gutterBottom>
            {userInfo.name}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {userInfo.email}
          </Typography>
          <Button variant="contained" onClick={() => setEditing(true)}>
            Edit
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default AccountPage;
