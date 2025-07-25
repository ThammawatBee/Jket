import useReportStore from "../store/reportStore"
import { Box, FileUpload, Text, Button, Icon, useFileUploadContext } from "@chakra-ui/react"
import { LuUpload } from "react-icons/lu"

interface Props {
  receiveFiles: File[],
  setSection: (section: string) => void,
  handleUploadXlsFile: (file: File, type: string) => Promise<boolean>,
  setReceiveFiles: (file: File[]) => void,
}

const Receive = ({ receiveFiles, setSection, handleUploadXlsFile, setReceiveFiles }: Props) => {
  const upload = useFileUploadContext()
  const { fetchReports } = useReportStore()

  return <Box width={"100%"} paddingLeft={"15vh"} paddingRight={"15vh"} paddingTop={"10vh"} paddingBottom={"10vh"}>
    <Button variant='outline' onClick={() => setSection('init')}>Back</Button>
    <Box marginTop={'25px'} display='flex' justifyContent='space-between' width="100%">
      <Box>
        <Text textStyle={'xl'} color={'#1A69AA'}>Upload</Text>
        <Text textStyle={'xl'} color={'#1A69AA'}>MMTH Receive file</Text>
      </Box>
      <Box>
        <FileUpload.HiddenInput />
        <FileUpload.Trigger asChild>
          <Button variant="solid" size="sm">
            Upload file
          </Button>
        </FileUpload.Trigger>
      </Box>
    </Box>
    <Box width="100%">
      <FileUpload.HiddenInput />
      <FileUpload.Dropzone>
        <Icon size="md" color="fg.muted">
          <LuUpload />
        </Icon>
        <FileUpload.DropzoneContent>
          <Box>Drag and drop files here</Box>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
    </Box>
    {
      receiveFiles.length ? receiveFiles.map(receiveFile =>
        <Box marginBottom={"15px"} marginTop={"15px"}>
          <FileUpload.Item key={receiveFile.name} file={receiveFile}>
            <FileUpload.ItemPreview />
            <FileUpload.ItemName />
            <FileUpload.ItemDeleteTrigger marginLeft={"auto"}
              onClick={() => {
                const filesToDelete = upload.acceptedFiles.filter(file => file.name === receiveFile.name)
                filesToDelete.forEach(file => {
                  upload.deleteFile(file)
                })
                setReceiveFiles(receiveFiles.filter(file => file.name !== receiveFile.name))
              }}
            />
          </FileUpload.Item>
        </Box>
      )
        : null
    }
    <Box>
      <Button variant="solid" marginTop={"20px"} disabled={receiveFiles.length === 0} onClick={async () => {
        let isUploadError = false
        for (const file of receiveFiles) {
          const result = await handleUploadXlsFile(file, "report")
          if (result) {
            isUploadError = true
          }
        }
        if (!isUploadError) {
          upload.clearFiles()
          setReceiveFiles([])
          fetchReports({ reset: true })
        }
      }}>Confirm Upload</Button>
    </Box>
  </Box>
}

export default Receive