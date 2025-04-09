export interface CreateReport {
  plantCode: string,
  venderCode: string,
  delNumber: string,
  delDate: string,
  delPeriod: number,
  delSlideDate: string | null,
  delSlidePeriod: number | null,
  receivedDate: string,
  delCtl: string,
  workGroup: string | null,
  poNo: string | null,
  materialName: string,
  poQty: number,
  receiveQty: number,
  receiveArea: string,
  followingProc: string,
  privilegeFlag: string,
  barcodeStatus: string,
  tagId: string,
  organizeId: string,
  vatSaleFlag: string,
}

export interface CreateDeliveryReport {
  venderCode: string;
  plantCode: string;
  deliveryNo: string;
  deliveryDate: string;
  partNo: string;
  qty: string;
  receiveArea: string;
  followingProc: string;
  vat: string;
  privilegeFlag: string;
  referenceNoTag: string;
}

export interface CreateInvoiceReport {
  dateShipped: string,
  invoiceNo: string,
  customerOrderNumber: string,
  price: string,
  salesAmount: string,
}