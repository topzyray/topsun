import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Checkbox } from "../../ui/checkbox";

type CheckboxSubjectComponentProps = {
  formControl: any;
  formName: string;
  formLabel: string;
  disabled: boolean;
};

export default function CheckboxSubjectComponent({
  formControl,
  formName,
  formLabel,
  disabled,
}: CheckboxSubjectComponentProps) {
  return (
    <FormField
      control={formControl}
      name={formName}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked)} // Toggle compulsory flag
              disabled={disabled}
            />
          </FormControl>
          <FormLabel>{formLabel}</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
