import AppBar from "../components/AppBar"
import { Box, Button, Checkbox, Field, Input, NativeSelect, Table, Text } from "@chakra-ui/react"
import DatePicker from "react-datepicker"
import { useEffect, useState } from "react";
import useBillingStore from "../store/billingStore";
import { exportBilling } from "../service/jket";
import { isEmpty, keys, pickBy } from "lodash";

const MMTHOrder = () => {
  const { billings, fetchBilling, search, offset, count, limit, onPageChange, onPageSizeChange, setSearch } = useBillingStore()
  const [status, setStatus] = useState('all')
  const [selectBilling, setSelectBilling] = useState<{ [key: string]: boolean }>({})
  useEffect(() => {
    if (!billings) {
      fetchBilling()
    }
  }, [])
  console.log('billings', billings)

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
                setSearch({ startDate: start, endDate: end })
              }}
              selectsRange={true}
              startDate={search?.startDate}
              endDate={search?.endDate}
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
      <Box marginTop="20px" display='fex' flexWrap='wrap'>
        {
          billings?.length ? billings.map(billing =>
            <Box width={'20%'} marginTop="10px">
              <Checkbox.Root size={'md'}
                checked={selectBilling[`${billing.invoice_invoice_no}`]}
                onCheckedChange={(e) => setSelectBilling({
                  ...selectBilling,
                  [`${billing.invoice_invoice_no}`]: !!e.checked
                })}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>{billing.invoice_invoice_no}</Checkbox.Label>
              </Checkbox.Root>
            </Box>
          ) : null
        }
        {/* {['2508951', '2508952', '2508953', '2508954', '2508955', '2508956'].map(item =>
          <Box width={'20%'} marginTop="10px">
            <Checkbox.Root size={'md'}
              checked={selectBilling[`${item}`]}
              onCheckedChange={(e) => setSelectBilling({
                ...selectBilling,
                [`${item}`]: !!e.checked
              })}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>{item}</Checkbox.Label>
            </Checkbox.Root>
          </Box>)
        } */}
      </Box>
      <Box marginTop={'20px'}>
        <Button
          disabled={isEmpty(pickBy(selectBilling, (billing) => billing))}
          onClick={async () => {
            const response = await exportBilling(keys(pickBy(selectBilling, (billing) => billing)), 'DIT')
            const url = window.URL.createObjectURL(new Blob([response as any]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'billing.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
          }}
        >Export DIT</Button>
      </Box>
      <Button marginTop={'20px'}
        disabled={isEmpty(pickBy(selectBilling, (billing) => billing))}
        onClick={async () => {
          const response = await exportBilling(keys(pickBy(selectBilling, (billing) => billing)), 'DITT')
          const url = window.URL.createObjectURL(new Blob([response as any]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'billing-ditt.xlsx');
          document.body.appendChild(link);
          link.click();
          link.remove();
        }}
      >Export DITT</Button>
    </Box>
  </Box>
}
export default MMTHOrder