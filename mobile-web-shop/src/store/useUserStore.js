import { create } from "zustand";

const useUserStore = create((set) => {
  const storedUserId = JSON.parse(localStorage.getItem("userId"));
  const loggedInUserId = storedUserId ? storedUserId : null;

  return {
    userId: loggedInUserId,

    login: async (loginDetails) => {
      const url = "https://saas-backend-api.vercel.app/api/user/login";
      try {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(loginDetails),
        });

        if (!response.ok) {
          const result = await response.json();
          return { message: result.message };
        }

        const { token, userId } = await response.json();
        set({ userId });
        localStorage.setItem("userId", JSON.stringify(userId));

        return { token };
      } catch (error) {
        console.error("Error logging in:", error);
      }
    },

    logout: () => {
      set({ userId: null });
      localStorage.removeItem("userId");
    },

    signUp: async (signUpData) => {
      const url = "https://saas-backend-api.vercel.app/api/user/signup";
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signUpData),
        });

        if (!response.ok) {
          const result = await response.json();
          return { message: result.message };
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.error("Error signing up:", error);
      }
    },
  };
});

export default useUserStore;
