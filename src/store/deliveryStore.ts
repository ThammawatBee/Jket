import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { DateTime } from 'luxon';
import { DeliveryReport } from '../interface/Report'
import { listDeliveryReports } from '../service/jket';
import pickBy from 'lodash/pickBy';

type DeliveryReportSearch = {
  dateStart?: Date
  dateEnd?: Date
}

interface ReportState {
  deliveryReports: DeliveryReport[] | null
  count: number
  isLoading: boolean
  error: any
  offset: number
  limit: number
  search: DeliveryReportSearch
  fetchDeliveryReports: (options?: { limit?: number, offset?: number, changePage?: boolean, reset?: boolean }) => Promise<void>
  onPageChange: (page: number) => Promise<void>
  onPageSizeChange: (pageSize: number) => Promise<void>
  setSearch: (input: DeliveryReportSearch) => void
  plantCode: string
  setPlantCode: (plantCode: string) => void
}

export const generateParam = (search: DeliveryReportSearch) => {
  let dateStart = search.dateStart ? DateTime.fromJSDate(search.dateStart).toFormat('dd-MM-yyyy') : ''
  let dateEnd = search.dateEnd ? DateTime.fromJSDate(search.dateEnd).toFormat('dd-MM-yyyy') : ''
  return pickBy({ dateStart, dateEnd }, (value) => !!value)
}

const useDeliveryStore = create<ReportState>()(
  devtools((set, get) => ({
    deliveryReports: null,
    count: 0,
    offset: 0,
    limit: 10,
    isLoading: false,
    error: null,
    monthly: new Date(),
    search: {},
    plantCode: 'ALL',


    fetchDeliveryReports: async (options?: { limit?: number, offset?: number, reset?: boolean, changePage?: boolean }) => {
      set({ isLoading: true, error: null });
      try {
        const limit = options?.limit || get().limit
        const offset = options?.offset || get().offset
        const currentDeliveryReports = get().deliveryReports
        const search = get().search
        const plantCode = get().plantCode
        const response = await listDeliveryReports({
          limit,
          offset: options?.reset ? 0 : offset,
          ...generateParam(search),
          plantCode,
        });
        set({
          deliveryReports: options?.changePage ?
            [...currentDeliveryReports?.length ? currentDeliveryReports : [],
            ...response.deliveryReports] : response.deliveryReports, count: response.count, isLoading: false,
          ...options?.reset ? { offset: 0 } : {}
        });
      } catch (error: any) {
        set({ isLoading: false });
        throw error
      }
    },
    onPageChange: async (page: number) => {
      const deliveryReports = get().deliveryReports
      const limit = get().limit
      const count = get().count
      const fetchDeliveryReports = get().fetchDeliveryReports
      if (deliveryReports) {
        if (deliveryReports?.length < page * limit && deliveryReports?.length < count) {
          await fetchDeliveryReports({ offset: deliveryReports.length, changePage: true, limit: (page * limit) - deliveryReports?.length })
          set({ offset: page - 1 })
        }
        else {
          set({ offset: page - 1 })
        }
      }
    },
    setSearch: (input: DeliveryReportSearch) => {
      const currentSearch = get().search
      set({ search: { ...currentSearch, ...input } })
    },
    setPlantCode: (plantCode: string) => { set({ plantCode }) },
    onPageSizeChange: async (pageSize: number) => {
      const { search } = get()
      const response = await listDeliveryReports({
        limit: pageSize,
        offset: 0,
        ...generateParam(search)
      });
      set({ deliveryReports: response.deliveryReports, count: response.count, offset: 0, limit: pageSize });
    },
  }))
)

export default useDeliveryStore