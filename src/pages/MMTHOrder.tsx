import AppBar from "../components/AppBar"
import { Box, Button, Input, Table, Text } from "@chakra-ui/react"
import DatePicker from "react-datepicker"
import { useEffect, useState } from "react";
import { DeliveryReport } from "../interface/Report";
import { listDeliveryReports } from "../service/jket";

const MMTHOrder = () => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [deliveryReports, setDeliveryReports] = useState<DeliveryReport[] | null>(null)

  const init = async () => {
    const data = await listDeliveryReports()
    setDeliveryReports(data.deliveryReports)
  }
  useEffect(() => {
    init()
  }, [])

  return <Box>
    <AppBar />
    <Box paddingLeft={"15vh"} paddingRight={"15vh"} paddingTop={"10vh"} paddingBottom={"10vh"}>
      <Box display='flex' justifyContent='space-between'>
        <Box>
          <Text marginBottom={"20px"} textStyle={'xl'} color={'#1A69AA'} fontWeight='bold'>MMTH Order</Text>
          <DatePicker
            dateFormat="dd-MM-yyyy"
            showMonthDropdown
            showYearDropdown
            isClearable
            onChange={(dates) => {
              const [start, end] = dates
              setStartDate(start)
              setEndDate(end)
              // setSearch({ resultDateStart: start, resultDateEnd: end })
            }}
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onKeyDown={(e) => e.preventDefault()}
            customInput={<Input
              width={'240px'}
              readOnly={true}
              background={'white'} />}
          />
        </Box>
        <Box display='flex' flexDirection='column'>
          <Button bg='#385723' marginTop='20px' fontWeight='bold'>Export as Excel</Button>
        </Box>
      </Box>
      <Box marginTop={'25px'}>
        <Table.Root size="md" showColumnBorder>
          <Table.Header>
            <Table.Row background={"#F6F6F6"}>
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
          <Table.Body>{
            deliveryReports?.length ?
              deliveryReports.map(deliveryReport => <Table.Row key={deliveryReport.id}>
                <Table.Cell>{deliveryReport.venderCode}</Table.Cell>
                <Table.Cell>{deliveryReport.plantCode}</Table.Cell>
                <Table.Cell>{deliveryReport.deliveryNo}</Table.Cell>
                <Table.Cell>{deliveryReport.deliveryDate}</Table.Cell>
                <Table.Cell>{deliveryReport.partNo}</Table.Cell>
                <Table.Cell>{+deliveryReport.qty}</Table.Cell>
                <Table.Cell>{deliveryReport.receiveArea}</Table.Cell>
                <Table.Cell>{deliveryReport.followingProc}</Table.Cell>
                <Table.Cell>{deliveryReport.vat}</Table.Cell>
                <Table.Cell>{deliveryReport.privilegeFlag}</Table.Cell>
                <Table.Cell>{deliveryReport.referenceNoTag}</Table.Cell>
              </Table.Row>)
              : null}</Table.Body>
        </Table.Root>
      </Box>
    </Box>
  </Box>
}
export default MMTHOrder