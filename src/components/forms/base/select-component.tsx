import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { SelectComponentProps } from "../../../../types";

export default function SelectComponent({
  formControl,
  formName,
  formLabel,
  formPlaceholder,
  formOptionLabel,
  formOptionData,
  disabled,
  inputClassName,
}: SelectComponentProps) {
  return (
    <FormField
      control={formControl}
      name={formName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{formLabel}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
            <FormControl>
              <SelectTrigger className={`py-5 text-lg lg:py-6 ${inputClassName}`}>
                <SelectValue placeholder={formPlaceholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="py-4 md:text-lg">{formOptionLabel}</SelectLabel>
                {formOptionData.map((item) => (
                  <SelectItem key={item.value} value={item.value} className="py-3 md:text-lg">
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
