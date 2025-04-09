import { CreateDeliveryReport, CreateReport, CreateInvoiceReport } from "@/interface/Report";
import axiosInstance from "./axios";
import type { DeliveryReport, Report } from '../interface/Report'

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

export const listReports = async () => {
  const response = await axiosInstance.get(`/reports`);
  return response as unknown as { reports: Report[] };
}

export const listDeliveryReports = async () => {
  const response = await axiosInstance.get(`/deliveries`);
  return response as unknown as { deliveryReports: DeliveryReport[] };
}


export const mergeWithDeliveryFile = async () => {
  const response = await axiosInstance.post(`/merge-delivery-report`);
  return response
}