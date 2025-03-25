import AppBar from "../components/AppBar"
import { Box, Button, FileUpload, Text } from "@chakra-ui/react"
import Invoice from '../assets/image/Invoice.png'
import MMTHOrder from '../assets/image/MMTHOrder.png'
import MMTHRecieve from '../assets/image/MMTHOrder.png'
import { useState } from "react"

const UploadPage = () => {
  const [section, setSection] = useState("init")
  const renderSection = () => {
    if (section === "receiveFile") {
      return <Box paddingLeft={"15vh"} paddingRight={"15vh"} paddingTop={"10vh"} paddingBottom={"10vh"}>
        <Button variant='outline' onClick={() => setSection('init')}>Back</Button>
        <Box marginTop={'25px'} display='flex' justifyContent='space-between'>
          <Box>
            <Text textStyle={'xl'} color={'#1A69AA'}>Upload</Text>
            <Text textStyle={'xl'} color={'#1A69AA'}>MMTH Receive file</Text>
          </Box>
          <Box>
            <FileUpload.Root accept={'.xls'} onFileChange={async (file) => {
              if (file.acceptedFiles?.[0]) {
                console.log('file', file)
              }
            }}>
              <FileUpload.HiddenInput />
              <FileUpload.Trigger asChild>
                <Button variant="outline" size="sm">
                  Upload file
                </Button>
              </FileUpload.Trigger>
            </FileUpload.Root>
          </Box>
        </Box>
      </Box>
    }
    else if (section === 'invoice') {
      return <Box paddingLeft={"15vh"} paddingRight={"15vh"} paddingTop={"10vh"} paddingBottom={"10vh"}>
        <Button variant='outline' onClick={() => setSection('init')}>Back</Button>
        <Box marginTop={'25px'} display='flex' justifyContent='space-between'>
          <Box>
            <Text textStyle={'xl'} color={'#1A69AA'}>Upload</Text>
            <Text textStyle={'xl'} color={'#1A69AA'}>Invoice</Text>
          </Box>
          <Box>
            <FileUpload.Root accept={'.xls'} onFileChange={async (file) => {
              if (file.acceptedFiles?.[0]) {
                console.log('file', file)
              }
            }}>
              <FileUpload.HiddenInput />
              <FileUpload.Trigger asChild>
                <Button variant="outline" size="sm">
                  Upload file
                </Button>
              </FileUpload.Trigger>
            </FileUpload.Root>
          </Box>
        </Box>
      </Box>
    }
    else if (section === 'orderFile') {
      return <Box paddingLeft={"15vh"} paddingRight={"15vh"} paddingTop={"10vh"} paddingBottom={"10vh"}>
        <Button variant='outline' onClick={() => setSection('init')}>Back</Button>
        <Box marginTop={'25px'} display='flex' justifyContent='space-between'>
          <Box>
            <Text textStyle={'xl'} color={'#1A69AA'}>Upload</Text>
            <Text textStyle={'xl'} color={'#1A69AA'}>MMTH Order file</Text>
          </Box>
          <Box>
            <FileUpload.Root accept={'.xls'} onFileChange={async (file) => {
              if (file.acceptedFiles?.[0]) {
                console.log('file', file)
              }
            }}>
              <FileUpload.HiddenInput />
              <FileUpload.Trigger asChild>
                <Button variant="outline" size="sm">
                  Upload file
                </Button>
              </FileUpload.Trigger>
            </FileUpload.Root>
          </Box>
        </Box>
      </Box>
    }
    return <Box height={'60.5vh'} display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
      <Box display='flex' alignItems='center' justifyContent='center' marginTop={'50px'}>
        <Box marginRight={"50px"}>
          <Box cursor={'pointer'} onClick={() => setSection("receiveFile")}>
            <Box display="flex" alignItems='center' justifyContent='center' borderColor="black" borderWidth="1px" width={'200px'} height={'200px'} background={'white'} borderRadius="20px">
              <img src={MMTHRecieve} style={{ width: '160xp', height: '160px' }} />
            </Box>
            <Text textAlign='center' textStyle="lg" marginTop={'15px'}>Upload</Text>
            <Text textAlign='center' textStyle="lg" marginTop={'15px'}>MMTH Receive file</Text>
          </Box>
        </Box>
        <Box marginRight={"50px"}>
          <Box cursor={'pointer'} onClick={() => setSection("invoice")}>
            <Box display="flex" alignItems='center' justifyContent='center' borderColor="black" borderWidth="1px" width={'200px'} height={'200px'} background={'white'} borderRadius="20px">
              <img src={Invoice} style={{ width: '160xp', height: '160px' }} />
            </Box>
            <Text textAlign='center' textStyle="lg" marginTop={'15px'}>Upload</Text>
            <Text textAlign='center' textStyle="lg" marginTop={'15px'}>Invoice file</Text>
          </Box>
        </Box>
        <Box>
          <Box cursor={'pointer'} onClick={() => setSection("orderFile")}>
            <Box display="flex" alignItems='center' justifyContent='center' borderColor="black" borderWidth="1px" width={'200px'} height={'200px'} background={'white'} borderRadius="20px">
              <img src={MMTHOrder} style={{ width: '160xp', height: '160px' }} />
            </Box>
            <Text textAlign='center' textStyle="lg" marginTop={'15px'}>Upload</Text>
            <Text textAlign='center' textStyle="lg" marginTop={'15px'}>MMTH Order file</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  }

  return <Box>
    <AppBar />
    {renderSection()}
  </Box>
}

export default UploadPage