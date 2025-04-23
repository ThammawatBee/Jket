const ReportHeaders = [
  "Plant Code",
  "Vendor Code",
  "Del No",
  "Del Date",
  "Del. Period",
  "Del Slide Date",
  "Del. Slide Period",
  "Received Date",
  "Del. Ctl",
  "Work Group",
  "Po No",
  "Material Name",
  "Material No",
  "PO Qty.",
  "Received Qty.",
  "Receive Area",
  "Following Proc",
  "Privilege Flag",
  "Barcode Status",
  "Tag ID",
  "Organize Id",
  "VAT Sale Flag"
]

const InvoiceHeaders = [
  "DATE SHIPPED",
  "INVOICE NO.(KSBP)",
  "CUSTOMER ORDER NUMBE",
  "PRICE",
  "SALES AMOUNT"
]

export const selectFileHeaders = (type:string) => {
  return type === 'report' ? ReportHeaders : InvoiceHeaders
}

export const checkErrorReportUploadHeader = (fileHeaders: string[] | undefined, type: string) => {
  if (!fileHeaders?.length) {
    return true
  }

  const missingHeaders = selectFileHeaders(type).filter(
    (header) => !fileHeaders.includes(header)
  );

  if (missingHeaders.length > 0) {
    return true
  }
  return false
}