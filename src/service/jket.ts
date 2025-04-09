import { CreateDeliveryReport, CreateReport, CreateInvoiceReport } from "@/interface/Report";
import axiosInstance from "./axios";

export const createReports = async (reports: CreateReport[]) => {
  const response = await axiosInstance.post(`/report`, { reports });
  return response;
}

export const createDeliveryReports = async (deliveryReports: CreateDeliveryReport[]) => {
  const response = await axiosInstance.post(`/delivery-report`, { deliveryReports });
  return response;
}

export const uploadInvoice = async (invoiceReports: CreateInvoiceReport[]) => {
  const response = await axiosInstance.post(`/invoice`, { invoiceReports });
  return response;
}