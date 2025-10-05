"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ComboboxComponentProps } from "../../../../types";

export function ComboboxComponent({
  formControl,
  formName,
  formLabel,
  formOptionLabel,
  formOptionData,
  formPlaceholder,
  formDescription,
  disabled,
  displayValue = (data: any) => data?.name, // Default to 'name' field for display
  valueField = "_id", // Default to '_id' for storing the value
}: ComboboxComponentProps) {
  return (
    <FormField
      control={formControl}
      name={formName}
      render={({ field }) => (
        <FormItem className="flex flex-col space-y-0.5">
          <FormLabel className="text-lg">{formLabel}</FormLabel>
          <Popover>
            <PopoverTrigger asChild className="py-5 lg:py-6">
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                >
                  {field.value
                    ? formOptionData.find((data: any) => data[valueField] === field.value)?.[
                        valueField
                      ] // Display the value based on valueField
                    : `${formOptionLabel}`}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder={formPlaceholder}
                  disabled={disabled}
                  className="h-9 md:h-10"
                />
                <CommandList>
                  <CommandEmpty>
                    No data. Add {formName.split("_").slice(0, 1)} to continue.
                  </CommandEmpty>
                  <CommandGroup>
                    {formOptionData
                      .filter((data: any) => data != null)
                      .map((data: any) => (
                        <CommandItem
                          className="py-3"
                          key={data[valueField]}
                          onSelect={() => {
                            field.onChange(data[valueField]);
                          }}
                        >
                          {displayValue(data)}
                          <Check
                            className={cn(
                              "ml-auto",
                              data[valueField] === field.value ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>{formDescription}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
