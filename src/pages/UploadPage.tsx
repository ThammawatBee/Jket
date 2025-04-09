import AppBar from "../components/AppBar"
import { Box, Button, FileUpload, Text } from "@chakra-ui/react"
import Invoice from '../assets/image/Invoice.png'
import MMTHOrder from '../assets/image/MMTHOrder.png'
import MMTHRecieve from '../assets/image/MMTHRecieve.png'
import Papa from 'papaparse';
import { useState } from "react"
import * as XLSX from 'xlsx';
import { DeliveryMapper, InvoiceMapper, ReceiveMapper } from "../helper/mapFileData"
import { createDeliveryReports, createReports, uploadInvoice } from "../service/jket"

const UploadPage = () => {
  const [section, setSection] = useState("init")
  const handleUploadXlsFile = (file: File, type: string) => {
    const reader = new FileReader();
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
            // isUploadError = true
            parser.abort(); // Stop processing further
            let errorMessage = ''
            if (error?.data?.message === 'Validation failed') {
              errorMessage = 'Upload report fail cause Validation failed'
            }
            else {
              errorMessage = 'Upload report fail please check file upload'
            }
            // toastUploadFileError(errorMessage)
            return
          }

        },
        complete: () => console.log('All chunks uploaded!'),
      });
    };

    reader.readAsArrayBuffer(file);
  }

  const handleUploadTxtFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const data = DeliveryMapper(content)
      await createDeliveryReports(data)
    };

    reader.readAsText(file);
  }

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
            <FileUpload.Root accept={['.xls','.xlsx']} onFileChange={async (file) => {
              if (file.acceptedFiles?.[0]) {
                handleUploadXlsFile(file.acceptedFiles?.[0], "report")
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
            <FileUpload.Root accept={['.xls','.xlsx']} onFileChange={async (file) => {
              if (file.acceptedFiles?.[0]) {
                handleUploadXlsFile(file.acceptedFiles?.[0], "invoice")
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
            <FileUpload.Root accept={'.txt'} onFileChange={async (file) => {
              if (file.acceptedFiles?.[0]) {
                handleUploadTxtFile(file.acceptedFiles?.[0])
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