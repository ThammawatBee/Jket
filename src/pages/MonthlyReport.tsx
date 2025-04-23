import AppBar from "../components/AppBar"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { Box, Button, ButtonGroup, IconButton, Input, Pagination, Table, Text } from "@chakra-ui/react"
import { useEffect } from "react";
import { DateTime } from "luxon";
import { exportReports, mergeWithDeliveryFile } from "../service/jket";
import { toast } from "react-toastify";
import useReportStore from "../store/reportStore";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import PageSizeSelect from "../components/PageSizeSelect";

const MonthlyReport = () => {
  const { reports, fetchReports, monthly, setMonthly, limit, onPageSizeChange, onPageChange, offset, count } = useReportStore()
  useEffect(() => {
    if (!reports) {
      fetchReports()
    }
  }, [])
  const mergeWithDelivery = async () => {
    await mergeWithDeliveryFile()
    toast.success('Merge with Delivery file success', {
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
    await fetchReports({ reset: true })
  }
  return <Box>
    <AppBar />
    <Box paddingLeft={"15vh"} paddingRight={"15vh"} paddingTop={"10vh"} paddingBottom={"10vh"}>
      <Box display='flex' justifyContent='space-between'>
        <Box>
          <Text marginBottom={"20px"} textStyle={'xl'} color={'#1A69AA'} fontWeight='bold'>Monthly Report</Text>
          <DatePicker
            selected={monthly}
            showMonthYearPicker
            onChange={(date) => {
              if (date) {
                setMonthly(date)
                fetchReports({ reset: true })
              }
            }}
            dateFormat="MM/yyyy"
            customInput={<Input
              readOnly={true}
              value={monthly ? DateTime.fromJSDate(monthly).toFormat('MM/yyyy') : ''}
              background={'white'} />}
          />
        </Box>
        <Box display='flex' flexDirection='column'>
          <Button bg='#002060' fontWeight='bold' onClick={() => { mergeWithDelivery() }}>Match with  MMTH order</Button>
          <Button bg='#385723' marginTop='20px' fontWeight='bold' onClick={async () => {
            const response = await exportReports({ monthly: DateTime.fromJSDate(monthly).toFormat('MM/yyyy') })
            const url = window.URL.createObjectURL(new Blob([response as any]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'reports.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
          }}>Export as Excel</Button>
        </Box>
      </Box>
      <Box marginTop={'25px'}>
        <Table.ScrollArea>
          <Table.Root size="md" showColumnBorder>
            <Table.Header>
              <Table.Row background={"#F6F6F6"}>
                <Table.ColumnHeader>Plant Code</Table.ColumnHeader>
                <Table.ColumnHeader>Vendor Code</Table.ColumnHeader>
                <Table.ColumnHeader>Del No</Table.ColumnHeader>
                <Table.ColumnHeader>Del Date</Table.ColumnHeader>
                <Table.ColumnHeader>Del. Period</Table.ColumnHeader>
                <Table.ColumnHeader>Del Slide Date</Table.ColumnHeader>
                <Table.ColumnHeader>Del. Slide Period</Table.ColumnHeader>
                <Table.ColumnHeader>Received Date</Table.ColumnHeader>
                <Table.ColumnHeader>Del. Ctl</Table.ColumnHeader>
                <Table.ColumnHeader>Work Group</Table.ColumnHeader>
                <Table.ColumnHeader>Po No</Table.ColumnHeader>
                <Table.ColumnHeader>Material No</Table.ColumnHeader>
                <Table.ColumnHeader>Material Name</Table.ColumnHeader>
                <Table.ColumnHeader>PO Qty.</Table.ColumnHeader>
                <Table.ColumnHeader>Received Qty.</Table.ColumnHeader>
                <Table.ColumnHeader>Receive Area</Table.ColumnHeader>
                <Table.ColumnHeader>Following Proc</Table.ColumnHeader>
                <Table.ColumnHeader>Privilege Flag</Table.ColumnHeader>
                <Table.ColumnHeader>Barcode Status</Table.ColumnHeader>
                <Table.ColumnHeader>Tag ID</Table.ColumnHeader>
                <Table.ColumnHeader>Organize Id</Table.ColumnHeader>
                <Table.ColumnHeader>VAT Sale Flag</Table.ColumnHeader>
                <Table.ColumnHeader>DATE SHIPPED</Table.ColumnHeader>
                <Table.ColumnHeader>INVOICE NO.(KSBP)</Table.ColumnHeader>
                <Table.ColumnHeader>CUSTOMER ORDER NUMBE</Table.ColumnHeader>
                <Table.ColumnHeader>PRICE</Table.ColumnHeader>
                <Table.ColumnHeader>SALES AMOUNT</Table.ColumnHeader>
                <Table.ColumnHeader>Vendor_code</Table.ColumnHeader>
                <Table.ColumnHeader>Plant_code</Table.ColumnHeader>
                <Table.ColumnHeader>Delivery_No</Table.ColumnHeader>
                <Table.ColumnHeader>Delivery_Date</Table.ColumnHeader>
                <Table.ColumnHeader>Part_No</Table.ColumnHeader>
                <Table.ColumnHeader>Q'ty</Table.ColumnHeader>
                <Table.ColumnHeader>Receive_area</Table.ColumnHeader>
                <Table.ColumnHeader>Following_proc</Table.ColumnHeader>
                <Table.ColumnHeader>Vat</Table.ColumnHeader>
                <Table.ColumnHeader>Privilege_Flag</Table.ColumnHeader>
                <Table.ColumnHeader>Reference_No_Tag</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {reports?.length ? reports.slice(offset * limit, (offset + 1) * limit).map(report =>
                <Table.Row key={report.id}>
                  <Table.Cell>{report.plantCode}</Table.Cell>
                  <Table.Cell>{report.venderCode}</Table.Cell>
                  <Table.Cell>{report.delNumber}</Table.Cell>
                  <Table.Cell>{DateTime.fromISO(report.delDate).toFormat('dd/MM/yyyy')} </Table.Cell>
                  <Table.Cell>{report.delPeriod}</Table.Cell>
                  <Table.Cell>{report.delSlideDate}</Table.Cell>
                  <Table.Cell>{report.delSlidePeriod}</Table.Cell>
                  <Table.Cell>{DateTime.fromISO(report.receivedDate).toFormat('dd/MM/yyyy')}</Table.Cell>
                  <Table.Cell>{report.delCtl}</Table.Cell>
                  <Table.Cell>{report.workGroup}</Table.Cell>
                  <Table.Cell>{report.poNo}</Table.Cell>
                  <Table.Cell>{report.materialNo}</Table.Cell>
                  <Table.Cell>{report.materialName}</Table.Cell>
                  <Table.Cell>{report.poQty}</Table.Cell>
                  <Table.Cell>{report.receiveQty}</Table.Cell>
                  <Table.Cell>{report.receiveArea}</Table.Cell>
                  <Table.Cell>{report.followingProc}</Table.Cell>
                  <Table.Cell>{report.privilegeFlag}</Table.Cell>
                  <Table.Cell>{report.barcodeStatus}</Table.Cell>
                  <Table.Cell>{report.tagId}</Table.Cell>
                  <Table.Cell>{report.organizeId}</Table.Cell>
                  <Table.Cell>{report.vatSaleFlag}</Table.Cell>
                  <Table.Cell>{report.invoiceDateShipped}</Table.Cell>
                  <Table.Cell>{report.invoiceInvoiceNo}</Table.Cell>
                  <Table.Cell>{report.invoiceCustomerOrderNumber}</Table.Cell>
                  <Table.Cell>{report.invoicePrice}</Table.Cell>
                  <Table.Cell>{report.invoiceSalesAmount}</Table.Cell>
                  <Table.Cell>{report.deliveryVenderCode}</Table.Cell>
                  <Table.Cell>{report.deliveryPlantCode}</Table.Cell>
                  <Table.Cell>{report.deliveryDeliveryNo}</Table.Cell>
                  <Table.Cell>{report.deliveryDeliveryDate && DateTime.fromISO(report.deliveryDeliveryDate).toFormat('dd/MM/yyyy')}</Table.Cell>
                  <Table.Cell>{report.deliveryPartNo}</Table.Cell>
                  <Table.Cell>{report.deliveryQty && +report.deliveryQty}</Table.Cell>
                  <Table.Cell>{report.deliveryReceiveArea}</Table.Cell>
                  <Table.Cell>{report.deliveryFollowingProc}</Table.Cell>
                  <Table.Cell>{report.deliveryVat}</Table.Cell>
                  <Table.Cell>{report.deliveryPrivilegeFlag}</Table.Cell>
                  <Table.Cell>{report.deliveryReferenceNoTag}</Table.Cell>
                </Table.Row>) : null}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
        {reports?.length ? <Box mt={'15px'} mb={'15px'} display='flex' justifyContent={'space-between'}>
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
      </Box>
    </Box>
  </Box>
}
export default MonthlyReport