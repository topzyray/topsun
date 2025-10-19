import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Checkbox } from "../../ui/checkbox";
import { Subject } from "../../../../types";
import { TextHelper } from "@/helpers/TextHelper";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";

type OtherCheck = { label: string; value: string };

type CheckboxComponentProps = {
  formControl: any;
  formName: string;
  formLabel: string;
  formDescription: ReactNode;
  formData: (OtherCheck | Subject)[];
  disabled: boolean;
};

export default function CheckboxComponent({
  formControl,
  formName,
  formLabel,
  formDescription,
  formData,
  disabled,
}: CheckboxComponentProps) {
  const allLabels = useMemo(
    () => formData.map((item) => ("_id" in item ? item.name : item.label)),
    [formData],
  );

  const currentValues = useWatch({
    control: formControl,
    name: formName,
  }) as string[];

  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    setAllSelected(currentValues.length === allLabels.length);
  }, [currentValues, allLabels]);

  const toggleSelectAll = (checked: boolean, onChange: (value: string[]) => void) => {
    if (checked) {
      onChange(allLabels);
    } else {
      onChange([]);
    }
  };

  return (
    <FormField
      control={formControl}
      name={formName}
      disabled={disabled}
      render={({ field }) => (
        <FormItem>
          <div>
            <FormLabel>{formLabel}</FormLabel>
            <FormDescription>{formDescription}</FormDescription>
          </div>

          {/* Select All Checkbox */}
          <div className="mb-2">
            <FormItem className="flex flex-row items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => toggleSelectAll(!!checked, field.onChange)}
                  disabled={disabled}
                />
              </FormControl>
              <FormLabel className="text-sm font-medium">Select All</FormLabel>
            </FormItem>
          </div>

          {/* Individual Checkboxes */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 rounded border p-2">
            {formData.map((item) => {
              const isSubject = "_id" in item;
              const itemLabel = isSubject ? item.name : item.label;

              return (
                <FormItem
                  key={isSubject ? item._id : item.label}
                  className="flex flex-row items-start space-y-0 space-x-3"
                >
                  <FormControl>
                    <Checkbox
                      checked={currentValues.includes(itemLabel)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...currentValues, itemLabel]);
                        } else {
                          field.onChange(currentValues.filter((val) => val !== itemLabel));
                        }
                      }}
                      className="capitalize"
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {TextHelper.capitalize(itemLabel)}
                  </FormLabel>
                </FormItem>
              );
            })}
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
