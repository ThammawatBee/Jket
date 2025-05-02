import useAuthStore from '../store/authStore';
import { JSX, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Spinner, Text } from "@chakra-ui/react"
import ResetPasswordDialog from '../components/ResetPasswordDialog';
import RefreshTokenDialog from '../components/RefreshTokenDialog';


const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { getProfile, profile } = useAuthStore()
  const [openRestPasswordDialog, setOpenRestPasswordDialog] = useState(false)
  const [openRefreshTokenDialog, setOpenRefreshTokenDialog] = useState(false)
  const navigate = useNavigate()
  const checkAuth = async () => {
    if (!profile) {
      try {
        await getProfile()
      } catch (err) {
        navigate('/login', { replace: true })
      }
    }
  };
  useEffect(() => {
    checkAuth();
  }, [])
  useEffect(() => {
    if (profile && profile.requirePasswordReset) {
      setOpenRestPasswordDialog(true)
    }
  }, [profile])

  const isRefreshTokenNearExpiry = () => {
    const expiresAt = localStorage.getItem('expiresAt');
    if (!expiresAt) return false;
    const currentUnix = Math.floor(Date.now() / 1000);
    const timeLeft = parseInt(expiresAt, 10) - currentUnix
    return timeLeft < 5 * 60; // 5 minutes
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRefreshTokenNearExpiry()) {
        setOpenRefreshTokenDialog(true)
      }
    }, 1 * 60 * 1000); // Check every 1 minutes

    return () => clearInterval(interval);
  }, []);

  if (profile === null) {
    <Box height={"90vh"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
      <Box>
        <Spinner size="xl" borderWidth="2px" />
      </Box>
      <Box marginTop={"15px"}>
        <Text textStyle={'md'} fontWeight='medium'>Loading...</Text>
      </Box>
    </Box>
  }

  return <div>
    <ResetPasswordDialog
      isOpenDialog={openRestPasswordDialog}
      setOpenDialog={setOpenRestPasswordDialog}
    />
    <RefreshTokenDialog isOpenDialog={openRefreshTokenDialog} setOpenDialog={setOpenRefreshTokenDialog} />
    {children}
  </div>;
}

export default PrivateRoute