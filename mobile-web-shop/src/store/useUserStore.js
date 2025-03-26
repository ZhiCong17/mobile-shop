import { create } from "zustand";

const useUserStore = create((set) => {
  const storedUserId = JSON.parse(localStorage.getItem("userId"));
  const loggedInUserId = storedUserId ? storedUserId : null;

  return {
    userId: loggedInUserId,

    login: async (loginDetails) => {
      const url = "http://localhost:3000/api/user/login";
      try {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(loginDetails),
        });

        if (!response.ok) {
          throw new Error("Response status:", response.status);
        }

        const { token, userId } = await response.json();
        set({ userId });
        localStorage.setItem("userId", JSON.stringify(userId));

        return token;
      } catch (error) {
        console.error("Error logging in:", error);
      }
    },

    logout: () => {
      set({ userId: null });
      localStorage.removeItem("userId");
    },
  };
});

export default useUserStore;
