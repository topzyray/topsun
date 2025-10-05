import { extractErrorMessage } from "@/utils/extract-error-utils";
import { toast } from "react-hot-toast";

export const triggerToastError = (error?: unknown, message?: string) => {
  const errorData = Object(error).body;
  const errorMessages = message ?? extractErrorMessage(errorData);
  console.log("Error : ", errorMessages);
  console.log("Error Type : ", typeof errorMessages);

  if (Array.isArray(errorMessages)) {
    errorMessages.forEach((message) => toast.error(message));
  } else {
    toast.error(errorMessages);
  }
};
