import AppBar from "../components/AppBar"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { Box, Button, Input, Text } from "@chakra-ui/react"
import { useState } from "react";
import { DateTime } from "luxon";

const MonthlyReport = () => {
  const [monthly, setMonthly] = useState(new Date())
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
          <Button bg='#002060' fontWeight='bold'>Match with  MMTH order</Button>
          <Button bg='#385723' marginTop='20px' fontWeight='bold'>Export as Excel</Button>
        </Box>
      </Box>
    </Box>
  </Box>
}
export default MonthlyReport