import { Box, Button, Input } from "@chakra-ui/react"
import Logo from '../assets/image/jtekt.png'
import { useState } from "react"

const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassowrd] = useState("")
  return <Box height={'90vh'} display='flex' alignItems='center' justifyContent='center'>
    <Box shadow={'0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -2px rgba(0, 0, 8, .1)'} width="400px" padding="20px" border={"1px solid #ECECEC"} borderRadius="10px">
      <Box display={'flex'} justifyContent={'center'}>
        <img src={Logo} style={{ height: "120px", width: "120px" }} />
      </Box>
      <Input marginTop={"25px"} value={username} onChange={e => { setUsername(e.currentTarget.value) }} />
      <Input marginTop={"25px"} value={password} type="password" onChange={e => { setPassowrd(e.currentTarget.value) }} />
      <Button  marginTop={"25px"} width="100%">Login</Button>
    </Box>
  </Box>
}

export default LoginPage