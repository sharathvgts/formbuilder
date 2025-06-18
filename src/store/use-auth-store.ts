import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface AuthState {
  role: string;
  token: string;
}

type Action = {
  updateAuthState: (changedPayload: Partial<AuthState>) => void;
  doLogOut: () => void;
 
};

const initialState = {
  role: '',
  token: '',
  permissions: null,
};
const useAuthStore = create<AuthState & Action>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,
        updateAuthState: (payload) =>
          set((state) => ({ ...state, ...payload })),
        doLogOut: () =>
          set(() => {
            window.location.href = "/"
            return initialState;
          }),


    
      })),
      {
        name: 'AUTH_STORE',
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          email: state.role,
          token: state.token,
         
        }),
      },
    ),
    {
      name: 'AuthStoreDevtools',
    },
  ),
);

export default useAuthStore;
