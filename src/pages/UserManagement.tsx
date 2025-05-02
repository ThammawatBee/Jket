import UserDialog from "../components/UserDialog"
import AppBar from "../components/AppBar"
import { Box, Button, ButtonGroup, IconButton, Pagination, Table, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import useUserStore from "../store/userStore"
import PageSizeSelect from "../components/PageSizeSelect"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { resetInitialPassword } from "../service/jket"
import SuccessToast from "../components/SuccessToast"

const UserManagement = () => {
  const [openModal, setOpenModal] = useState(false)
  const { users, limit, onPageSizeChange, onPageChange, offset, count, search, setSearch, fetchUsers } = useUserStore()
  useEffect(() => {
    if (!users) {
      fetchUsers()
    }
  }, [])
  const onResetPassword = async (userId: string, username: string) => {
    await resetInitialPassword(userId)
    SuccessToast(`Reset password ${username} success`)
  }

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
          {
            users?.length ? users.slice(offset * limit, (offset + 1) * limit).map(user =>
              <Table.Row>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.division}</Table.Cell>
                <Table.Cell>{user.role}</Table.Cell>
                <Table.Cell><Button background='#002060' onClick={async () => {
                  await onResetPassword(user.id, user.name)
                }}>Reset Password</Button></Table.Cell>
              </Table.Row>
            ) : null
          }
        </Table.Body>
      </Table.Root>
      {users?.length ? <Box mt={'15px'} mb={'15px'} display='flex' justifyContent={'space-between'}>
        <Box display={'flex'} fontSize={'14px'} alignItems={'center'}>
          Row per page
          <Box ml={"15px"} width={'50px'}>
            <PageSizeSelect limit={limit} onChangePageSize={async (pageSize: number) => {
              await onPageSizeChange(pageSize)
            }} />
          </Box>
          <Box ml={"15px"}>
            {(offset * limit) + 1} - {count < (limit * (offset + 1)) ? count : (limit * (offset + 1))} of {count}
          </Box>
        </Box>
        <Pagination.Root
          count={count}
          pageSize={limit}
          page={offset + 1}
          onPageChange={async (details: { page: number, pageSize: number }) => {
            await onPageChange(details.page)
          }}
        >
          <ButtonGroup variant="ghost">
            <Pagination.PrevTrigger asChild>
              <IconButton>
                <LuChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>
            <Pagination.Items
              render={(page) => (
                <IconButton variant={{ base: "ghost", _selected: "solid" }}>
                  {page.value}
                </IconButton>
              )}
            />
            <Pagination.NextTrigger asChild>
              <IconButton>
                <LuChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      </Box> : <Box height={'75px'} />}
      <Box marginTop="20px" display='flex' justifyContent='flex-end'>
        <Button background={'#385723'} onClick={() => setOpenModal(true)}>Add new User</Button>
      </Box>
    </Box>
    <UserDialog isOpenDialog={openModal} setOpenDialog={setOpenModal} />
  </Box>
}

export default UserManagement