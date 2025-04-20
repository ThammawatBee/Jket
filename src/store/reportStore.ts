import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { DateTime } from 'luxon';
import { Report } from '../interface/Report'
import { listReports } from '../service/jket';

interface ReportState {
  reports: Report[] | null
  count: number
  isLoading: boolean
  error: any
  offset: number
  limit: number
  fetchReports: (options?: { limit?: number, offset?: number, changePage?: boolean, reset?: boolean }) => Promise<void>
  monthly: Date
  setMonthly: (monthly: Date) => void
  onPageChange: (page: number) => Promise<void>
  onPageSizeChange: (pageSize: number) => Promise<void>
}

const useReportStore = create<ReportState>()(
  devtools((set, get) => ({
    reports: null,
    count: 0,
    offset: 0,
    limit: 10,
    isLoading: false,
    error: null,
    monthly: new Date(),
    search: {},

    fetchReports: async (options?: { limit?: number, offset?: number, reset?: boolean, changePage?: boolean }) => {
      set({ isLoading: true, error: null });
      try {
        const limit = options?.limit || get().limit
        const offset = options?.offset || get().offset
        const monthly = get().monthly
        const currentReports = get().reports
        const response = await listReports({
          limit,
          offset: options?.reset ? 0 : offset,
          monthly: DateTime.fromJSDate(monthly).toFormat('MM/yyyy'),
        });
        set({
          reports: options?.changePage ?
            [...currentReports?.length ? currentReports : [],
            ...response.reports] : response.reports, count: response.count, isLoading: false,
          ...options?.reset ? { offset: 0 } : {}
        });
      } catch (error: any) {
        set({ isLoading: false });
        throw error
      }
    },
    setMonthly: (date: Date) => { set({ monthly: date }) },
    onPageChange: async (page: number) => {
      const reports = get().reports
      const limit = get().limit
      const count = get().count
      const fetchReports = get().fetchReports
      if (reports) {
        if (reports?.length < page * limit && reports?.length < count) {
          await fetchReports({ offset: reports.length, changePage: true, limit: (page * limit) - reports?.length })
          set({ offset: page - 1 })
        }
        else {
          set({ offset: page - 1 })
        }
      }
    },
    onPageSizeChange: async (pageSize: number) => {
      const monthly = get().monthly
      const response = await listReports({
        limit: pageSize,
        offset: 0,
        monthly: DateTime.fromJSDate(monthly).toFormat('MM/yyyy'),
      });
      set({ reports: response.reports, count: response.count, offset: 0, limit: pageSize });
    },
  }))
)

export default useReportStore