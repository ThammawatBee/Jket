import findIndex from "lodash/findIndex"

export const ReceiveMapper = (data: any) => {
  return {
    plantCode: data["Plant Code"],
    venderCode: data["Vendor Code"],
    delNumber: data["Del No"],
    delDate: data["Del Date"],
    delPeriod: +data["Del. Period"],
    delSlideDate: data["Del Slide Date"] || null,
    delSlidePeriod: +data["Del. Slide Period"] || null,
    receivedDate: data["Received Date"],
    delCtl: data["Del. Ctl"],
    workGroup: data["Work Group"] || null,
    poNo: data["Po No"] || null,
    materialName: data["Material Name"],
    materialNo: data["Material No"],
    poQty: +data["PO Qty."],
    receiveQty: +data["Received Qty."],
    receiveArea: data["Receive Area"],
    followingProc: data["Following Proc"],
    privilegeFlag: data["Privilege Flag"],
    barcodeStatus: data["Barcode Status"],
    tagId: data["Tag ID"],
    organizeId: data["Organize Id"],
    vatSaleFlag: data["VAT Sale Flag"]
  }
}

export const InvoiceMapper = (data: any) => {
  return {
    dateShipped: data["DATE SHIPPED"],
    invoiceNo: data["INVOICE NO.(KSBP)"],
    customerOrderNumber: data["CUSTOMER ORDER NUMBE"],
    price: data["PRICE"],
    salesAmount: data["SALES AMOUNT"]
  }
}

export const DeliveryMapper = (data: string) => {
  let rawDeliveryData = data.split("|")
  const endFileIndex = findIndex(rawDeliveryData, (raw) => raw === '9999999999')
  rawDeliveryData = rawDeliveryData.filter((_, index) => index < endFileIndex)
  const chunkSize = 35;
  const chunks: string[][] = [];

  for (let i = 0; i < rawDeliveryData.length; i += chunkSize) {
    const chunk = rawDeliveryData.slice(i, i + chunkSize);
    if (chunk.length === 35) {
      chunks.push(chunk)
    }
  }
  const deliveryData = chunks.map(chunk => ({
    venderCode: chunk[1],
    plantCode: chunk[2],
    deliveryNo: chunk[4],
    deliveryDate: chunk[5],
    partNo: chunk[7],
    qty: chunk[8],
    receiveArea: chunk[10],
    followingProc: chunk[11],
    vat: chunk[12],
    privilegeFlag: chunk[26],
    referenceNoTag: chunk[27],

  }))
  return deliveryData

}