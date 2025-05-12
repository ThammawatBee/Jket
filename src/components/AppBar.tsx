import { Box, Text } from '@chakra-ui/react';
import { Link, useLocation } from "react-router-dom"
import AppBarLogo from '../assets/image/AppBar-logo.jpg'
import useAuthStore from '../store/authStore';

const AppBar = () => {
  const location = useLocation();
  const renderTabText = (pathname: string, text: string) => {
    // eslint-disable-next-line react/jsx-no-undef
    return <Box bg={location.pathname === pathname ? '#1A69AA' : '#373535'} p={'4'}><Text fontWeight={location.pathname === pathname ? 'bold' : 'normal'}>{text}</Text></Box>
  }
  const { profile } = useAuthStore()
  return <Box bg='#373535' width="100%" color="white" display='flex' alignItems='center'>
    <img src={AppBarLogo} style={{ height: "55px", width: "125px" }} />
    <Box marginRight='20px'>
      <Link to="/upload">{renderTabText('/upload', 'Upload')}</Link>
    </Box>
    <Box marginRight='20px'>
      <Link to="/monthly-report">{renderTabText('/monthly-report', 'Monthly Report')}</Link>
    </Box>
    <Box marginRight='20px'>
      <Link to="/mmth-order">{renderTabText('/mmth-order', 'MMTH Order')}</Link>
    </Box>
    <Box marginRight='20px'>
      <Link to="/export-mmth-billing">{renderTabText('/export-mmth-billing', 'Export MMTH Billing')}</Link>
    </Box>
    {profile && profile.role === 'admin' ? <Box marginRight='20px'>
      <Link to="/user-management">{renderTabText('/user-management', 'User Management')}</Link>
    </Box> : null}
  </Box>
}

export default AppBar