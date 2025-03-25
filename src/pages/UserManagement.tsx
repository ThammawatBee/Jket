import UserDialog from "../components/UserDialog"
import AppBar from "../components/AppBar"
import { Box, Button, Table, Text } from "@chakra-ui/react"
import { useState } from "react"

const UserManagement = () => {
  const [openModal, setOpenModal] = useState(false)
  return <Box>
    <AppBar />
    <Box paddingLeft={"15vh"} paddingRight={"15vh"} paddingTop={"10vh"} paddingBottom={"10vh"}>
      <Text marginBottom={"20px"} textStyle={'xl'} color={'#1A69AA'} fontWeight='bold'>User Management</Text>
      <Table.Root size="md">
        <Table.Header>
          <Table.Row background={"#F9FAFB"}>
            <Table.ColumnHeader>User Name</Table.ColumnHeader>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Division</Table.ColumnHeader>
            <Table.ColumnHeader>Role</Table.ColumnHeader>
            <Table.ColumnHeader></Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>65025</Table.Cell>
            <Table.Cell>Mr.A</Table.Cell>
            <Table.Cell>A</Table.Cell>
            <Table.Cell>Admin</Table.Cell>
            <Table.Cell><Button background='#002060'>Reset Password</Button></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
      <Box marginTop="20px" display='flex' justifyContent='flex-end'>
        <Button background={'#385723'} onClick={() => setOpenModal(true)}>Add new User</Button>
      </Box>
    </Box>
    <UserDialog isOpenDialog={openModal} setOpenDialog={setOpenModal} />
  </Box>
}

export default UserManagement