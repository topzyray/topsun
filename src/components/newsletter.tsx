import { useContext, useState } from "react";
import { GlobalContext } from "@/providers/global-state-provider";
import SubmitButton from "./buttons/SubmitButton";
import { Input } from "./ui/input";

type FormDataType = {
  email: string;
};

const Newsletter = () => {
  const [formData, setFormData] = useState<FormDataType>({
    email: "",
  });

  const { componentLevelLoader } = useContext(GlobalContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      email: e.target.value,
    }));
  };

  const handleSubmit = () => {
    console.log(formData);
  };

  const validateFormInput = () => {
    return formData && formData.email && formData.email.trim() ? true : false;
  };

  return (
    <>
      <h4 className="pb-2 text-base font-bold sm:mb-4 lg:text-lg">
        Get Our Latest Offerings at Landifi
      </h4>
      <div className="flex flex-wrap gap-1">
        <div className="w-full">
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Email address"
            autoComplete="email"
            className="input w-full max-w-[20rem] font-normal text-gray-600"
            onChange={handleChange}
          />
        </div>

        <SubmitButton
          disabled={!validateFormInput() || componentLevelLoader.loading}
          onSubmit={handleSubmit}
          loading={componentLevelLoader && componentLevelLoader.loading}
        />
      </div>
    </>
  );
};

export default Newsletter;
