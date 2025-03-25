import AppBar from "../components/AppBar"
import { Box, Field, Input, NativeSelect, Text } from "@chakra-ui/react"
import DatePicker from "react-datepicker"
import { useState } from "react";

const MMTHOrder = () => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [status, setStatus] = useState('all')
  return <Box>
    <AppBar />
    <Box paddingLeft={"15vh"} paddingRight={"15vh"} paddingTop={"10vh"} paddingBottom={"10vh"}>
      <Text marginBottom={"20px"} textStyle={'xl'} color={'#1A69AA'} fontWeight='bold'>MMTH Billing</Text>
      <Box display='flex'>
        <Box>
          <Field.Root>
            <Field.Label>Select Date</Field.Label>
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

          </Field.Root>
        </Box>
        <Box marginLeft={"25px"}>
          <Field.Root>
            <Field.Label>Select Status</Field.Label>
            <NativeSelect.Root width="240px">
              <NativeSelect.Field
                placeholder="Select option"
                value={status}
                onChange={(e) => setStatus(e.currentTarget.value)}
              >
                <option value="all">All</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
        </Box>
      </Box>
    </Box>
  </Box>
}
export default MMTHOrder