import { getProfile, resetPassword } from "../service/jket";
import { Profile } from "../interface/Auth";
import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

interface AuthState {
  profile: Profile | null
  removeProfile: () => void
  getProfile: () => Promise<void>
  resetPassword: (password:string) => Promise<void>
}
const useAuthStore = create<AuthState>()(
  devtools((set, get) => ({
    profile: null,
    removeProfile: () => { set({ profile: null }) },
    getProfile: async () => {
      const profile = await getProfile()
      set({ profile: profile })
    },
    resetPassword: async (password: string) => {
      await resetPassword(password)
      const profile = await getProfile()
      set({ profile: profile })
    }
  })))

export default useAuthStore