import { create } from "zustand";
import { persist } from "zustand/middleware";

export type VerificationType = "sign-in" | "email-verification";

interface AuthState {
  // Email for OTP verification
  email: string;
  setEmail: (email: string) => void;
  verificationType: VerificationType;
  setVerficationType: (verificationType: VerificationType) => void;
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
      name: "",
      email: "",
      password: "",
      verificationType: "sign-in",
      setEmail: (email) => set({ email }),
      setVerficationType: (verificationType) => set({ verificationType }),
      clearEmail: () => set({ email: "" }),

      // Verification state
      isVerifying: false,
      setIsVerifying: (isVerifying) => set({ isVerifying }),

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
