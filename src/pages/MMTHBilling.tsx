import AppBar from "../components/AppBar"
import { Box, Button, Checkbox, Field, Input, NativeSelect, Table, Text } from "@chakra-ui/react"
import DatePicker from "react-datepicker"
import { useState } from "react";
import useBillingStore from "../store/billingStore";
import { exportBilling, exportBillingTXT } from "../service/jket";
import { isEmpty, keys, pickBy } from "lodash";
import '../DatePicker.css'

const MMTHOrder = () => {
  const { billings, fetchBilling, search, offset, count, limit, onPageChange, onPageSizeChange, setSearch, clearBilling } = useBillingStore()
  const [selectBilling, setSelectBilling] = useState<{ [key: string]: boolean }>({})
  // useEffect(() => {
  //   if (!billings) {
  //     fetchBilling()
  //   }
  // }, [])

  return <Box>
    <AppBar />
    <Box paddingLeft={"15vh"} paddingRight={"15vh"} paddingTop={"10vh"} paddingBottom={"10vh"}>
      <Text marginBottom={"20px"} textStyle={'xl'} color={'#1A69AA'} fontWeight='bold'>MMTH Billing</Text>
      <Box display='flex'>
        <Box>
          <Field.Root>
            <Field.Label>Select Plant Code</Field.Label>
            <NativeSelect.Root width="240px">
              <NativeSelect.Field
                placeholder="Select Plant Code"
                value={search.plantCode}
                onChange={(e) => setSearch({ plantCode: e.currentTarget.value })}
              >
                <option value="B">B</option>
                <option value="D">D</option>
                <option value="F">F</option>
                <option value="G">G</option>
                <option value="H">H</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
        </Box>
        <Box marginLeft={"25px"}>
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
                if (!start && !end) {
                  clearBilling()
                }
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
                value={search.status}
                onChange={(e) => setSearch({ status: e.currentTarget.value })}
              >
                <option value="ALL">All</option>
                <option value="NEW">New</option>
                <option value="EXPORTED">Exported</option>
                <option value="EXPORTED_DIT">Exported {`(DIT)`}</option>
                <option value="EXPORTED_DITT">Exported {`(DITT)`}</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
        </Box>
      </Box>
      <Button
        onClick={() => {
          fetchBilling()
          setSelectBilling({})
        }}
        marginTop="20px"
        disabled={!search.endDate || !search.startDate}
      >Search</Button>
      <Box marginTop="20px" display='fex' flexWrap='wrap'>
        {
          billings?.length ? billings.map(billing => {
            return <Box width={'20%'} marginTop="10px">
              <Checkbox.Root size={'md'}
                checked={selectBilling[`${billing.invoice_invoice_no}`] || false}
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
          }) : null
        }
      </Box>
      <Box marginTop={'20px'}>
        <Box display='flex'>
          <Button
            bg='#385723'
            disabled={isEmpty(pickBy(selectBilling, (billing) => billing))}
            onClick={async () => {
              const response = await exportBilling(keys(pickBy(selectBilling, (billing) => billing)), 'DIT')
              const url = window.URL.createObjectURL(new Blob([response as any]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `${search.plantCode}IT043.xlsx`);
              document.body.appendChild(link);
              link.click();
              link.remove();
            }}
          >{`Export ${search.plantCode}IT .xlsx`}</Button>
          <Button
            marginLeft="25px"
            disabled={isEmpty(pickBy(selectBilling, (billing) => billing))}
            onClick={async () => {
              const response = await exportBillingTXT(keys(pickBy(selectBilling, (billing) => billing)), 'DIT')
              const url = window.URL.createObjectURL(new Blob([response as any]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `${search.plantCode}IT043.txt`);
              document.body.appendChild(link);
              link.click();
              link.remove();
            }}
          >
            {`Export ${search.plantCode}IT .txt`}
          </Button>
        </Box>
      </Box>
      <Box marginTop={'20px'}>
        <Button
          bg='#385723'
          disabled={isEmpty(pickBy(selectBilling, (billing) => billing))}
          onClick={async () => {
            const response = await exportBilling(keys(pickBy(selectBilling, (billing) => billing)), 'DITT')
            const url = window.URL.createObjectURL(new Blob([response as any]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${search.plantCode}ITT043.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
          }}
        >{`Export ${search.plantCode}ITT .xlsx`}</Button>
        <Button
          marginLeft="25px"
          disabled={isEmpty(pickBy(selectBilling, (billing) => billing))}
          onClick={async () => {
            const response = await exportBillingTXT(keys(pickBy(selectBilling, (billing) => billing)), 'DITT')
            const url = window.URL.createObjectURL(new Blob([response as any]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${search.plantCode}ITT043.txt`);
            document.body.appendChild(link);
            link.click();
            link.remove();
          }}
        >
          {`Export ${search.plantCode}ITT .txt`}
        </Button>
      </Box>
    </Box>
  </Box>
}
export default MMTHOrder