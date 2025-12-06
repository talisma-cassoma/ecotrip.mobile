import { useContext } from "react";
import { AuthContext  } from "@/context/userAuthContext";

export const useUserAuth = () => {
  const context = useContext(AuthContext);  // ← directly get the context

  if (!context)
    throw new Error("useUserAuth must be used within an AuthProvider");
  
  return context;
}