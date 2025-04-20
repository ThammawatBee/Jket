import AppBar from "../components/AppBar"
import { Box, Button, ButtonGroup, IconButton, Input, Pagination, Table, Text } from "@chakra-ui/react"
import DatePicker from "react-datepicker"
import { useEffect } from "react";
import useDeliveryStore, { generateParam } from "../store/deliveryStore";
import PageSizeSelect from "../components/PageSizeSelect";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { DateTime } from "luxon";
import { exportDeliveryReports } from "../service/jket";

const MMTHOrder = () => {
  const { deliveryReports, fetchDeliveryReports, search, offset, count, limit, onPageChange, onPageSizeChange, setSearch } = useDeliveryStore()
  useEffect(() => {
    if (!deliveryReports) {
      fetchDeliveryReports()
    }
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
              setSearch({
                dateStart: start,
                dateEnd: end
              })
              if (start && end) {
                fetchDeliveryReports({ reset: true })
              }
            }}
            selectsRange={true}
            startDate={search.dateStart}
            endDate={search.dateEnd}
            onKeyDown={(e) => e.preventDefault()}
            customInput={<Input
              width={'240px'}
              readOnly={true}
              background={'white'} />}
          />
        </Box>
        <Box display='flex' flexDirection='column'>
          <Button bg='#385723' marginTop='20px' fontWeight='bold'
            onClick={async () => {
              const response = await exportDeliveryReports(generateParam(search))
              const url = window.URL.createObjectURL(new Blob([response as any]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'reports.xlsx');
              document.body.appendChild(link);
              link.click();
              link.remove();
            }}
          >Export as Excel</Button>
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
              deliveryReports.slice(offset * limit, (offset + 1) * limit).map(deliveryReport => <Table.Row key={deliveryReport.id}>
                <Table.Cell>{deliveryReport.venderCode}</Table.Cell>
                <Table.Cell>{deliveryReport.plantCode}</Table.Cell>
                <Table.Cell>{deliveryReport.deliveryNo}</Table.Cell>
                <Table.Cell>{DateTime.fromISO(deliveryReport.deliveryDate).toFormat('dd/MM/yyyy')}</Table.Cell>
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
        {deliveryReports?.length ? <Box mt={'15px'} mb={'15px'} display='flex' justifyContent={'space-between'}>
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
export default MMTHOrder