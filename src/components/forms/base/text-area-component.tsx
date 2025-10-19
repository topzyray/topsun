import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { TextAreaComponentProps } from "../../../../types";
import { Textarea } from "@/components/ui/textarea";

export default function TextAreaComponent({
  formControl,
  formName,
  formLabel,
  formPlaceholder,
  formDescription,
  rows,
  disabled,
  inputClassName,
}: TextAreaComponentProps) {
  return (
    <FormField
      control={formControl}
      name={formName}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{formLabel}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={formPlaceholder}
              className={`text-lg ${inputClassName}`}
              disabled={disabled}
              rows={rows ?? 10}
              {...field}
            />
          </FormControl>
          <FormDescription>{formDescription}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
