import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  // Email for OTP verification
  email: string;
  setEmail: (email: string) => void;
  clearEmail: () => void;

  // OTP verification state
  isVerifying: boolean;
  setIsVerifying: (isVerifying: boolean) => void;

  // Reset all auth state
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Email state
      email: "",
      setEmail: (email: string) => set({ email }),
      clearEmail: () => set({ email: "" }),

      // Verification state
      isVerifying: false,
      setIsVerifying: (isVerifying: boolean) => set({ isVerifying }),

      // Reset all state
      reset: () =>
        set({
          email: "",
          isVerifying: false,
        }),
    }),
    {
      name: "auth-store",
      // Only persist email and attempts, not verification state
      partialize: (state) => ({
        email: state.email,
      }),
    },
  ),
);
