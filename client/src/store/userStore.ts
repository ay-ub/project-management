import Notify from "@/lib/Notify";
import { User } from "@/types/user";
import { create } from "zustand";
interface UserState {
  user: User | null;
  loading: boolean;
  registerLoading: boolean;
  login: (userData: { email: string; password: string }) => void;
  logout: () => void;
  authing: () => void;
  register: (userData: User) => void;
}
const useUser = create<UserState>((set) => ({
  user: null,
  loading: true,
  registerLoading: false,
  login: async (userData: { email: string; password: string }) => {
    try {
      set({
        loading: true,
      });
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (data.status == "success") {
        set({
          user: data.data,
        });
        Notify(`welcome ${data.data.name} ${data.data.familyName}`, "success");
      }
    } catch (error) {
      console.log(error);
    } finally {
      set({
        loading: false,
      });
    }
  },
  logout: async () => {
    try {
      set({
        loading: true,
      });
      const res = await fetch("/api/user/logout");
      const isLogout = await res.json();
      console.log("logout res ", isLogout);
      if (isLogout.status === "success") {
        set({
          user: null,
        });
        Notify(isLogout.message, "success");
      }
    } catch (error) {
      console.log(error);
    } finally {
      set({
        loading: false,
      });
    }
  },
  authing: async () => {
    try {
      set({
        loading: true,
      });
      const result = await fetch("/api/user/");
      const user = await result.json();
      if (user.status === "success") {
        set({
          user: user.data,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      set({
        loading: false,
      });
    }
  },
  register: async (userData: User) => {
    try {
      set({
        registerLoading: true,
      });
      if (
        !userData.email ||
        !userData.password ||
        !userData.name ||
        !userData.familyName
      ) {
        Notify("Email and password are required", "error");
        return;
      }
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (data.status === "success") {
        Notify("User registered successfully", "success");
        set({
          user: data.data,
        });
      } else {
        Notify(data.message || "email already exists", "error");
        console.log(data);
      }
    } catch (error) {
      console.log(error);
      Notify("something went wrong please try again", "error");
    } finally {
      set({
        registerLoading: false,
      });
    }
  },
}));

useUser.getState().authing();
export default useUser;
