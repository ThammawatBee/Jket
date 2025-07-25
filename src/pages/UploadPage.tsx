import AppBar from "../components/AppBar"
import { Box, FileUpload, Text, useFileUpload } from "@chakra-ui/react"
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
import { checkErrorReportUploadHeader } from "../helper/checkFileHeader"
import reverse from "lodash/reverse"
import uniqBy from "lodash/unionBy"
import Receive from "../components/Receive"
import InvoiceComponent from "../components/Invoice"
import Order from "../components/Order"

const UploadPage = () => {
  const [section, setSection] = useState("init")
  const [receiveFiles, setReceiveFiles] = useState<File[]>([])
  const [invoiceFiles, setInvoiceFiles] = useState<File[]>([])
  const [deliveryReportFiles, setDeliveryReportFiles] = useState<File[]>([])
  const fileUpload = useFileUpload()

  const handleUploadXlsFile = async (file: File, type: string): Promise<boolean> => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
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
                await createReports(results.data.map(data => ReceiveMapper(data)).filter(report => report.venderCode === 'T043'))
              }
              if (type === 'invoice') {
                await uploadInvoice(reverse(uniqBy(reverse(results.data.map(data => InvoiceMapper(data))), 'customerOrderNumber')))
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
              resolve(true); // resolve with error
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
            }
            resolve(isUploadError);
          },
          error: (error: any) => {
            // setUploadLoading(false)
            console.log('Error parsing CSV:', error);
          },
        });
      };
      reader.readAsArrayBuffer(file);
    })
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

  const handleUploadTxtFile = async (file: File): Promise<boolean> => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
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
          resolve(false); // success → no error
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
          resolve(true); // error occurred
        }
      };

      reader.readAsText(file);
    });
  }

  const renderSection = () => {
    if (section === "receiveFile") {
      return <FileUpload.Root maxFiles={20}
        accept={['.xls', '.xlsx']}
        onFileAccept={async (file) => {
          if (file.files?.length) {
            setReceiveFiles(unionBy(file.files, "name"))
          }
        }}>
        <Receive
          receiveFiles={receiveFiles}
          setSection={setSection}
          handleUploadXlsFile={handleUploadXlsFile}
          setReceiveFiles={setReceiveFiles} />
      </FileUpload.Root>
    }
    else if (section === 'invoice') {
      return <FileUpload.Root maxFiles={20} accept={['.xls', '.xlsx']} onFileChange={async (file) => {
        if (file.acceptedFiles?.length) {
          setInvoiceFiles(unionBy(file.acceptedFiles, "name"))
        }
      }}>
        <InvoiceComponent
          invoiceFiles={invoiceFiles}
          setSection={setSection}
          handleUploadXlsFile={handleUploadXlsFile}
          setInvoiceFiles={setInvoiceFiles} />
      </FileUpload.Root>
    }
    else if (section === 'orderFile') {
      return <FileUpload.Root maxFiles={20} accept={'.txt'} onFileChange={async (file) => {
        if (file.acceptedFiles?.length) {
          setDeliveryReportFiles(unionBy(file.acceptedFiles, "name"))
        }
      }}>
        <Order deliveryReportFiles={deliveryReportFiles}
          setSection={setSection}
          handleUploadTxtFile={handleUploadTxtFile}
          setDeliveryReportFiles={setDeliveryReportFiles}
        />
      </FileUpload.Root>
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