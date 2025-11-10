import { create } from "zustand";
import { persist } from "zustand/middleware";

export type VerificationType = "sign-in" | "email-verification";

interface AuthState {
  // Email for OTP verification
  email: string;
  setEmail: (email: string) => void;
  verificationType: VerificationType;
  setVerficationType: (verificationType: VerificationType) => void;

  // OTP verification state
  isVerifying: boolean;
  setIsVerifying: (isVerifying: boolean) => void;

  // Reset all auth state
  reset: () => void;
}

export const VERIFICATION_EMAIL_COOKIE_NAME = "verification_email";
export const VERIFICATION_EMAIL_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Email state
      name: "",
      email: "",
      password: "",
      verificationType: "sign-in",
      setEmail: (email) => {
        document.cookie = `${VERIFICATION_EMAIL_COOKIE_NAME}=${email}; path=/; max-age=${VERIFICATION_EMAIL_COOKIE_MAX_AGE}`;
        set({ email });
      },
      setVerficationType: (verificationType) => set({ verificationType }),

      // Verification state
      isVerifying: false,
      setIsVerifying: (isVerifying) => set({ isVerifying }),

      // Reset all state
      reset: () => {
        document.cookie = `${VERIFICATION_EMAIL_COOKIE_NAME}=; path=/; max-age=${VERIFICATION_EMAIL_COOKIE_MAX_AGE}`;
        set({
          email: "",
          isVerifying: false,
        });
      },
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
