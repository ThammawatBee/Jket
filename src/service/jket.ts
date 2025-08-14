import { CreateDeliveryReport, CreateReport, CreateInvoiceReport } from "@/interface/Report";
import axiosInstance from "./axios";
import type { Billing, DeliveryReport, ListBillingOptions, ListDeliveryReportOptions, ListReportOptions, ListUserOptions, Report } from '../interface/Report'
import { CreateUser, User } from "../interface/User";
import { LoginPayload, Profile } from "../interface/Auth";

export const login = async (payload: LoginPayload) => {
  const response = await axiosInstance.post('/auth/login', { ...payload })
  return response as unknown as { access_token: string, expiresAt: number }
}

export const extendAuth = async () => {
  const response = await axiosInstance.post('/auth/extend')
  return response as unknown as { access_token: string, expiresAt: number }
}

export const getProfile = async () => {
  const response = await axiosInstance.get('/auth/me')
  return response as unknown as Profile
}

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

export const listReports = async (options?: ListReportOptions) => {
  try {
    const response = await axiosInstance.get(`/reports`, { params: options });
    return response as unknown as { reports: Report[], count: number };
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
}

export const listDeliveryReports = async (options: ListDeliveryReportOptions) => {
  const response = await axiosInstance.get(`/deliveries`, { params: options });
  return response as unknown as { deliveryReports: DeliveryReport[], count: number };
}


export const mergeWithDeliveryFile = async () => {
  const response = await axiosInstance.post(`/merge-delivery-report`);
  return response
}

export const exportDeliveryReports = async (options: ListDeliveryReportOptions) => {
  const response = await axiosInstance.get(`/deliveries/export`, { params: options, responseType: 'blob', });
  return response
}

export const exportReports = async (options: ListReportOptions) => {
  const response = await axiosInstance.get(`/reports/export`, { params: options, responseType: 'blob', });
  return response
}

export const createUser = async (data: CreateUser) => {
  const response = await axiosInstance.post(`/users`, { ...data });
  return response as unknown as { users: User[], count: number };
}

export const listUsers = async (options: ListUserOptions) => {
  const response = await axiosInstance.get(`/users`, { params: options });
  return response as unknown as { users: User[], count: number };
}

export const resetPassword = async (password: string) => {
  const response = await axiosInstance.patch(`/users/reset-password`, { password });
  return response
}

export const resetInitialPassword = async (userId: string) => {
  const response = await axiosInstance.patch(`/users/reset-initial-password`, { userId });
  return response
}


export const listBilling = async (options: ListBillingOptions) => {
  const response = await axiosInstance.get(`/billing`, { params: options });
  return response as unknown as { billings: Billing[], count: number };
}

export const exportBilling = async (billings: string[], type: string) => {
  const response = await axiosInstance.post(`/billing/export`,
    { billings, type },
    { responseType: 'blob', });
  return response
}

export const exportBillingTXT = async (billings: string[], type: string) => {
  const response = await axiosInstance.post(`/billing/text/export`,
    { billings, type },
    { responseType: 'blob', });
  return response
}

export const getReportSummary = async (options?: ListReportOptions) => {
  try {
    const response = await axiosInstance.get(`/reports/summary`, { params: options });
    return response as unknown as {
      ALL: number;
      NO_MERGE: number;
      MERGE_WITH_INVOICE: number;
      MERGE_WITH_ORDER: number;
      ALREADY_MERGED: number;
    };
  } catch (error) {
    console.error('Error fetching summary reports:', error);
    throw error;
  }
}