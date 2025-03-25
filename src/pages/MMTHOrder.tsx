import AppBar from "../components/AppBar"
import { Box, Button, Input, Text } from "@chakra-ui/react"
import DatePicker from "react-datepicker"
import { useState } from "react";

const MMTHOrder = () => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
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
    </Box>
  </Box>
}
export default MMTHOrder