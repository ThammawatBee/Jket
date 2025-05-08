import { listBilling } from "../service/jket";
import { Billing } from "../interface/Report"
import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { DateTime } from "luxon";
import pickBy from "lodash/pickBy";


type BillingSearch = {
  startDate?: Date
  endDate?: Date
  status?: string
}

interface BillingState {
  billings: Billing[] | null
  count: number
  isLoading: boolean
  error: any
  offset: number
  limit: number
  fetchBilling: (options?: { limit?: number, offset?: number, changePage?: boolean, reset?: boolean }) => Promise<void>
  search: BillingSearch
  onPageChange: (page: number) => Promise<void>
  onPageSizeChange: (pageSize: number) => Promise<void>
  setSearch: (input: BillingSearch) => void
  clearBilling: () => void
}


const useBillingStore = create<BillingState>()(
  devtools((set, get) => ({
    billings: null,
    count: 0,
    offset: 0,
    limit: 10,
    isLoading: false,
    error: null,
    monthly: new Date(),
    search: { status: 'ALL' },

    fetchBilling: async (options?: { limit?: number, offset?: number, reset?: boolean, changePage?: boolean }) => {
      set({ isLoading: true, error: null });
      try {
        const limit = options?.limit || get().limit
        const offset = options?.offset || get().offset
        const currentBillings = get().billings
        const search = get().search
        const response = await listBilling({
          limit,
          offset: options?.reset ? 0 : offset,
          status: search.status,
          ...search.startDate && search.endDate ? {
            startDate: DateTime.fromJSDate(search.startDate).toFormat('yyyyMMdd'),
            endDate: DateTime.fromJSDate(search.endDate).toFormat('yyyyMMdd')
          } : {},
        });
        set({
          billings: options?.changePage ?
            [...currentBillings?.length ? currentBillings : [],
            ...response.billings] : response.billings, count: response.count, isLoading: false,
          ...options?.reset ? { offset: 0 } : {}
        });
      } catch (error: any) {
        set({ isLoading: false });
        throw error
      }
    },
    onPageChange: async (page: number) => {
      const billings = get().billings
      const limit = get().limit
      const count = get().count
      const fetchBilling = get().fetchBilling
      if (billings) {
        if (billings?.length < page * limit && billings?.length < count) {
          await fetchBilling({ offset: billings.length, changePage: true, limit: (page * limit) - billings?.length })
          set({ offset: page - 1 })
        }
        else {
          set({ offset: page - 1 })
        }
      }
    },
    setSearch: (input: BillingSearch) => {
      const currentSearch = get().search
      set({ search: { ...currentSearch, ...input } })
    },
    onPageSizeChange: async (pageSize: number) => {
      const { search } = get()
      const response = await listBilling({
        limit: pageSize,
        offset: 0,
        ...pickBy(search, (search) => !!search),
      });
      set({ billings: response.billings, count: response.count, offset: 0, limit: pageSize });
    },
    clearBilling: () => {
      set({ billings: null })
    }
  }))
)

export default useBillingStore