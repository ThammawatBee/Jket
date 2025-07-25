import useDeliveryStore from "../store/deliveryStore"
import { Box, FileUpload, Text, Button, Icon, useFileUploadContext } from "@chakra-ui/react"
import { LuUpload } from "react-icons/lu"

interface Props {
  deliveryReportFiles: File[],
  setSection: (section: string) => void,
  handleUploadTxtFile: (file: File) => Promise<boolean>,
  setDeliveryReportFiles: (file: File[]) => void,
}

const Order = ({ deliveryReportFiles, setSection, handleUploadTxtFile, setDeliveryReportFiles }: Props) => {
  const upload = useFileUploadContext()
  const { fetchDeliveryReports } = useDeliveryStore()

  return <Box width={"100%"} paddingLeft={"15vh"} paddingRight={"15vh"} paddingTop={"10vh"} paddingBottom={"10vh"}>
    <Button variant='outline' onClick={() => setSection('init')}>Back</Button>
    <Box marginTop={'25px'} display='flex' justifyContent='space-between' width="100%">
      <Box>
        <Text textStyle={'xl'} color={'#1A69AA'}>Upload</Text>
        <Text textStyle={'xl'} color={'#1A69AA'}>MMTH Order file</Text>
      </Box>
      <Box>
        <FileUpload.HiddenInput />
        <FileUpload.Trigger asChild>
          <Button variant="outline" size="sm">
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
      deliveryReportFiles.length ? deliveryReportFiles.map(deliveryReportFile =>
        <Box marginBottom={"15px"} marginTop={"15px"}>
          <FileUpload.Item key={deliveryReportFile.name} file={deliveryReportFile}>
            <FileUpload.ItemPreview />
            <FileUpload.ItemName />
            <FileUpload.ItemDeleteTrigger marginLeft={"auto"}
              onClick={() => {
                const filesToDelete = upload.acceptedFiles.filter(file => file.name === deliveryReportFile.name)
                filesToDelete.forEach(file => {
                  upload.deleteFile(file)
                })
                setDeliveryReportFiles(deliveryReportFiles.filter(file => file.name !== deliveryReportFile.name))
              }}
            />
          </FileUpload.Item>
        </Box>
      )
        : null
    }
    <Box>
      <Button variant="solid" marginTop={"20px"} disabled={deliveryReportFiles.length === 0} onClick={async () => {
        let isUploadError = false
        for (const file of deliveryReportFiles) {
          const result = await handleUploadTxtFile(file)
          if (result) {
            isUploadError = true
          }
        }
        if (!isUploadError) {
          upload.clearFiles()
          setDeliveryReportFiles([])
          fetchDeliveryReports({ reset: true })
        }
      }}>Confirm Upload</Button>
    </Box>
  </Box>
}

export default Order