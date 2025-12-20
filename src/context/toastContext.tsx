import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export type ToastType = "success" | "error" | "info";

export interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export interface ToastContextProps {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside a ToastProvider");
  }
  return context;
};

interface ProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: "",
    type: "info",
  });

  const opacity = useRef(new Animated.Value(0)).current;

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 2500) => {
      setToast({ visible: true, message, type });

      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          setToast((prev) => ({ ...prev, visible: false }));
        });
      }, duration);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast.visible && (
        <Animated.View
          style={[
            styles.toastContainer,
            styles[toast.type],
            { opacity },
          ]}
        >
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    maxWidth: "90%",
    zIndex: 999,
    elevation: 4,
  },
  toastText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  success: { backgroundColor: "#4CAF50" },
  error: { backgroundColor: "#F44336" },
  info: { backgroundColor: "#2196F3" },
});
