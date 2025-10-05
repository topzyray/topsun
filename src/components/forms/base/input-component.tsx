import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { InputComponentProps } from "../../../../types";
import { useState } from "react";
import { EyeIcon, EyeOff } from "lucide-react";
import { TextHelper } from "@/helpers/TextHelper";

export default function InputComponent({
  formControl,
  formName,
  formLabel,
  formInputType,
  formPlaceholder,
  isPassword,
  formMaxYear,
  formMinYear,
  editable,
  disabled,
  inputClassName,
}: InputComponentProps) {
  const [visible, setVisible] = useState(false);
  return (
    <FormField
      control={formControl}
      name={formName}
      render={({ field }) => {
        // Custom onChange wrapper
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const rawValue = e.target.value;

          if (formInputType === "date") {
            // Convert local date to UTC ISO string before updating form state
            const utcValue = TextHelper.dateInputToUTC(rawValue);
            field.onChange(utcValue);
          } else {
            // For other input types, just forward the raw value
            field.onChange(rawValue);
          }
        };

        return (
          <FormItem className="space-y-0.5">
            <FormLabel className={`text-lg ${isPassword && "flex items-center justify-between"}`}>
              {formLabel}{" "}
              {isPassword && (
                <span className="cursor-pointer">
                  {visible ? (
                    <EyeOff onClick={() => setVisible(false)} />
                  ) : (
                    <EyeIcon onClick={() => setVisible(true)} />
                  )}
                </span>
              )}
            </FormLabel>
            <FormControl>
              <Input
                disabled={disabled}
                type={isPassword && visible ? "text" : formInputType}
                placeholder={formPlaceholder}
                max={formMaxYear}
                min={formMinYear}
                readOnly={editable}
                {...field}
                onChange={handleChange}
                value={
                  formInputType === "date" && field.value
                    ? field.value.slice(0, 10)
                    : field.value || ""
                }
                className={`py-5 lg:py-6 ${inputClassName}`}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
