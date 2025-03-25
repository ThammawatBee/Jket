import { Box, Text } from '@chakra-ui/react';
import { Link, useLocation } from "react-router-dom"

const AppBar = () => {
  const location = useLocation();
  const renderTabText = (pathname: string, text: string) => {
    // eslint-disable-next-line react/jsx-no-undef
    return <Text fontWeight={location.pathname === pathname ? 'bold' : 'normal'} color={location.pathname === pathname ? '#C0C0C0' : 'white'}>{text}</Text>
  }
  return <Box bg='#373535' width="100%" padding="4" color="white" display='flex' alignItems='center'>
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
    <Box marginRight='20px'>
      <Link to="/user-management">{renderTabText('/user-management', 'User Management')}</Link>
    </Box>
  </Box>
}

export default AppBar