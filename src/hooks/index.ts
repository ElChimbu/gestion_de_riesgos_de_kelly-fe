import { useContext, createContext } from "react";

interface ToastContextType {
	toastType: string;
	setToastType: React.Dispatch<React.SetStateAction<string>>;
}

export const ToastContext = createContext<ToastContextType>({
	toastType: "",
	setToastType: () => {},
});
export const useToast = () => useContext(ToastContext);
