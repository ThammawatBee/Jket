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

export interface DeliveryReport {
  id: string
  plantCode: string
  venderCode: string
  deliveryNo: string
  deliveryDate: string
  partNo: string
  qty: string
  receiveArea: string
  followingProc: string
  vat: string
  privilegeFlag: string
  referenceNoTag: string;
}
export interface Report {
  id: string
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
  materialNo: string,
  poQty: number,
  receiveQty: number,
  receiveArea: string,
  followingProc: string,
  privilegeFlag: string,
  barcodeStatus: string,
  tagId: string,
  organizeId: string,
  vatSaleFlag: string,

  invoiceDateShipped: string | null, // invoice
  invoiceInvoiceNo: string | null,// invoice
  invoiceCustomerOrderNumber: string | null,// invoice
  invoicePrice: string | null,// invoice
  invoiceSalesAmount: string | null,// invoice

  deliveryPlantCode: string | null, // delivery
  deliveryVenderCode: string | null, // delivery
  deliveryDeliveryNo: string | null, // delivery
  deliveryDeliveryDate: string | null, // delivery
  deliveryPartNo: string | null, // delivery
  deliveryQty: string | null, // delivery
  deliveryReceiveArea: string | null, // delivery
  deliveryFollowingProc: string | null, // delivery
  deliveryVat: string | null, // delivery
  deliveryPrivilegeFlag: string | null, // delivery
  deliveryReferenceNoTag: string | null, // delivery
}

export interface Billing {
  invoice_invoice_no: number
}

export interface ListReportOptions {
  offset?: number
  limit?: number
  monthly?: string
}

export interface ListDeliveryReportOptions {
  dateStart?: string
  dateEnd?: string
  offset?: number
  limit?: number
}

export interface ListUserOptions {
  username?: string
  name?: string
  offset?: number
  limit?: number
}

export interface ListBillingOptions {
  startDate?: string
  endDate?: string
  offset?: number
  limit?: number
}