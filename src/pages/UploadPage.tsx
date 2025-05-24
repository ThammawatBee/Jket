import AppBar from "../components/AppBar"
import { Box, Button, FileUpload, Icon, Text, useFileUpload, useFileUploadContext } from "@chakra-ui/react"
import Invoice from '../assets/image/Invoice.png'
import MMTHOrder from '../assets/image/MMTHOrder.png'
import MMTHRecieve from '../assets/image/MMTHRecieve.png'
import Papa from 'papaparse';
import { useState } from "react"
import * as XLSX from 'xlsx';
import unionBy from 'lodash/unionBy'
import { DeliveryMapper, InvoiceMapper, ReceiveMapper } from "../helper/mapFileData"
import { createDeliveryReports, createReports, uploadInvoice } from "../service/jket"
import { toast } from "react-toastify"
import { LuUpload } from "react-icons/lu"
import { checkErrorReportUploadHeader, selectFileHeaders } from "../helper/checkFileHeader"

const UploadPage = () => {
  const [section, setSection] = useState("init")
  const [receiveFiles, setReceiveFiles] = useState<File[]>([])
  const [invoiceFiles, setInvoiceFiles] = useState<File[]>([])
  const [deliveryReportFiles, setDeliveryReportFiles] = useState<File[]>([])
  const fileUpload = useFileUpload({})


  const handleUploadXlsFile = (file: File, type: string) => {
    const reader = new FileReader();
    let isUploadError = false
    let isCheckHeader = false
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'array' });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const csv = XLSX.utils.sheet_to_csv(sheet); // ✅ Convert to CSV string

      // Now stream parse this CSV with PapaParse
      Papa.parse(csv, {
        header: true,
        chunkSize: 1024 * 1024, // 1MB chunk
        chunk: async (results: Papa.ParseResult<any>, parser: Papa.Parser) => {
          parser.pause();
          const headers = results.meta?.fields
          if (!isCheckHeader && (!headers?.length || checkErrorReportUploadHeader(headers, type))) {
            isUploadError = true
            parser.abort(); // Stop processing further
            toastUploadFileError(`Please check ${file.name} upload header file`)
            return
          }
          isCheckHeader = true
          try {
            if (type === 'report') {
              await createReports(results.data.map(data => ReceiveMapper(data)))
            }
            if (type === 'invoice') {
              await uploadInvoice(results.data.map(data => InvoiceMapper(data)))
            }
            parser.resume(); // Resume parsing after successful upload
          } catch (error: any) {
            parser.pause()
            isUploadError = true
            parser.abort(); // Stop processing further
            let errorMessage = ''
            if (error?.data?.detail) {
              errorMessage = `Upload ${file.name} fail cause ${error?.data?.detail}`
            }
            else if (error?.data?.message === 'Validation failed') {
              errorMessage = `Upload ${file.name} fail cause Validation failed`
            }
            else {
              errorMessage = `Upload ${file.name} fail please check file upload`
            }
            toastUploadFileError(errorMessage)
            return
          }

        },
        complete: () => {
          if (!isUploadError) {
            toast.success(type === 'report' ? `Upload Receive ${file.name} success` : `Upload Invoice ${file.name} success`, {
              style: { color: '#18181B' },
              position: "top-right",
              autoClose: 3500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            isUploadError = false
            isCheckHeader = false
            if (type === 'report') {
              setReceiveFiles(receiveFiles.filter(receiveFile => receiveFile.name !== file.name))
            } else {
              setInvoiceFiles(invoiceFiles.filter(invoiceFile => file.name !== invoiceFile.name))
            }
          }
        },
        error: (error: any) => {
          // setUploadLoading(false)
          console.log('Error parsing CSV:', error);
        },
      });
    };

    reader.readAsArrayBuffer(file);
  }

  const toastUploadFileError = (message: string) => {
    toast.error(message, {
      style: { color: '#18181B' },
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  const handleUploadTxtFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const data = DeliveryMapper(content)
      try {
        await createDeliveryReports(data)
        toast.success(`Upload Delivery ${file.name} success`, {
          style: { color: '#18181B' },
          position: "top-right",
          autoClose: 3500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
        setDeliveryReportFiles(deliveryReportFiles.filter(deliveryReportFile => deliveryReportFile.name !== file.name))
      } catch (error: any) {
        let errorMessage = ''
        if (error?.data?.detail) {
          errorMessage = `Upload ${file.name} fail cause ${error?.data?.detail}`
        }
        else if (error?.data?.message === 'Validation failed') {
          errorMessage = `Upload ${file.name} fail cause Validation failed`
        }
        else {
          errorMessage = `Upload ${file.name} fail please check file upload`
        }
        toastUploadFileError(errorMessage)
      }
    };

    reader.readAsText(file);
  }

  const renderSection = () => {
    if (section === "receiveFile") {
      return <Box paddingLeft={"15vh"} paddingRight={"15vh"} paddingTop={"10vh"} paddingBottom={"10vh"}>
        <Button variant='outline' onClick={() => setSection('init')}>Back</Button>
        <FileUpload.Root maxFiles={20} accept={['.xls', '.xlsx']} onFileChange={async (file) => {
          if (file.acceptedFiles?.length) {
            setReceiveFiles(unionBy(file.acceptedFiles, "name"))
          }
        }}>
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
              <FileUpload.Item key={receiveFile.name} file={receiveFile}>
                <FileUpload.ItemPreview />
                <FileUpload.ItemName />
                <FileUpload.ItemDeleteTrigger marginLeft={"auto"}
                  onClick={() => {
                    setReceiveFiles(receiveFiles.filter(file => file.name !== receiveFile.name))
                  }}
                />
              </FileUpload.Item>
            )
              : null
          }
        </FileUpload.Root>
        <Box>
          <Button variant="solid" marginTop={"20px"} disabled={receiveFiles.length === 0} onClick={async () => {
            for (const file of receiveFiles) {
              handleUploadXlsFile(file, "report")
            }

          }}>Confirm Upload</Button>
        </Box>
      </Box>
    }
    else if (section === 'invoice') {
      return <Box paddingLeft={"15vh"} paddingRight={"15vh"} paddingTop={"10vh"} paddingBottom={"10vh"}>
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
            for (const file of invoiceFiles) {
              handleUploadXlsFile(file, "invoice")
            }
          }}>Confirm Upload</Button>
        </Box>
      </Box>
    }
    else if (section === 'orderFile') {
      return <Box paddingLeft={"15vh"} paddingRight={"15vh"} paddingTop={"10vh"} paddingBottom={"10vh"}>
        <Button variant='outline' onClick={() => setSection('init')}>Back</Button>
        <FileUpload.Root maxFiles={20} accept={'.txt'} onFileChange={async (file) => {
          if (file.acceptedFiles?.length) {
            setDeliveryReportFiles(unionBy(file.acceptedFiles, "name"))
          }
        }}>
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
              <FileUpload.Item key={deliveryReportFile.name} file={deliveryReportFile}>
                <FileUpload.ItemPreview />
                <FileUpload.ItemName />
                <FileUpload.ItemDeleteTrigger marginLeft={"auto"}
                  onClick={() => {
                    setDeliveryReportFiles(deliveryReportFiles.filter(file => file.name !== deliveryReportFile.name))
                  }}
                />
              </FileUpload.Item>
            )
              : null
          }
        </FileUpload.Root>
        <Box>
          <Button variant="solid" marginTop={"20px"} disabled={deliveryReportFiles.length === 0} onClick={async () => {
            for (const file of deliveryReportFiles) {
              handleUploadTxtFile(file)
            }
          }}>Confirm Upload</Button>
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
    <FileUpload.RootProvider value={fileUpload}>
      <Box width={"100%"}>
        {renderSection()}
      </Box>
    </FileUpload.RootProvider>
  </Box>
}

export default UploadPage