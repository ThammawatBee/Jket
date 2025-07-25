import useReportStore from "../store/reportStore"
import { Box, FileUpload, Text, Button, Icon, useFileUploadContext } from "@chakra-ui/react"
import unionBy from "lodash/unionBy"
import { LuUpload } from "react-icons/lu"

interface Props {
  invoiceFiles: File[],
  setSection: (section: string) => void,
  handleUploadXlsFile: (file: File, type: string) => Promise<boolean>,
  setInvoiceFiles: (file: File[]) => void,
}

const InvoiceComponent = ({ invoiceFiles, setSection, handleUploadXlsFile, setInvoiceFiles }: Props) => {
  const upload = useFileUploadContext()
  const { fetchReports } = useReportStore()

  return <Box width={"100%"} paddingLeft={"15vh"} paddingRight={"15vh"} paddingTop={"10vh"} paddingBottom={"10vh"}>
    <Button variant='outline' onClick={() => setSection('init')}>Back</Button>
    <FileUpload.Root maxFiles={20} accept={['.xls', '.xlsx']} onFileChange={async (file) => {
      if (file.acceptedFiles?.length) {
        setInvoiceFiles(unionBy(file.acceptedFiles, "name"))
      }
    }}>
      <Box marginTop={'25px'} display='flex' justifyContent='space-between' width="100%">
        <Box>
          <Text textStyle={'xl'} color={'#1A69AA'}>Upload</Text>
          <Text textStyle={'xl'} color={'#1A69AA'}>Invoice</Text>
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
        invoiceFiles.length ? invoiceFiles.map(invoiceFile =>
          <FileUpload.Item key={invoiceFile.name} file={invoiceFile}>
            <FileUpload.ItemPreview />
            <FileUpload.ItemName />
            <FileUpload.ItemDeleteTrigger marginLeft={"auto"}
              onClick={() => {
                const filesToDelete = upload.acceptedFiles.filter(file => file.name === invoiceFile.name)
                filesToDelete.forEach(file => {
                  upload.deleteFile(file)
                })
                setInvoiceFiles(invoiceFiles.filter(file => file.name !== invoiceFile.name))
              }}
            />
          </FileUpload.Item>
        )
          : null
      }
    </FileUpload.Root>
    <Box>
      <Button variant="solid" marginTop={"20px"} disabled={invoiceFiles.length === 0} onClick={async () => {
        let isUploadError = false
        for (const file of invoiceFiles) {
          const result = await handleUploadXlsFile(file, "invoice")
          if (result) {
            isUploadError = true
          }
        }
        if (!isUploadError) {
          upload.clearFiles()
          setInvoiceFiles([])
          fetchReports({ reset: true })
        }
      }}>Confirm Upload</Button>
    </Box>
  </Box>
}

export default InvoiceComponent