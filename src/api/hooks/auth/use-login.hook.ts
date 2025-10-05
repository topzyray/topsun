import { RouteHelper } from "./../../../helpers/RouteHelper";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { GlobalContext } from "@/providers/global-state-provider";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { StorageUtilsHelper } from "@/utils/storage-utils";
import { STORE_KEYS } from "@/configs/store.config";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { AuthApiService } from "@/api/services/AuthApiService";
import { extractErrorMessage } from "@/utils/extract-error-utils";

export const useLogin = () => {
  const { setUserDetails } = useAuth();
  const { setShowNavModal } = useContext(GlobalContext);
  const router = useRouter();

  const { mutate: loginUser, isPending: isLoggingIn } = useCustomMutation(
    AuthApiService.authLogin,
    {
      onSuccessCallback: (data) => {
        const { accessToken, refreshToken, user } = data;

        StorageUtilsHelper.saveToLocalStorage(
          [STORE_KEYS.USER_ACCESS_TOKEN, accessToken],
          [STORE_KEYS.USER_REFRESH_TOKEN, refreshToken],
          [STORE_KEYS.USER_DETAILS, user],
        );
        setUserDetails(user);

        router.push(RouteHelper.getDashboardPath(user));
        setShowNavModal(false);
      },

      onErrorCallback: (error) => {
        const message = extractErrorMessage(error);
        if (message === "Please verify your email with the token sent to your email address...") {
          setTimeout(() => {
            router.push("/email-verification");
          }, 2000);
        }
      },
    },
  );

  return {
    loginUser,
    isLoggingIn,
  };
};
