"use client";

import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { ResultApiService } from "@/api/services/ResultApiService";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResultSettingComponent } from "../../../../types";
import { TextLoader } from "@/components/loaders/page-level-loader";
import ErrorBox from "@/components/atoms/error-box";

interface IResultHeaderInput {
  classLevel: string;
  formControl: any;
  formName: string;
  formLabel?: string;
  formPlaceholder?: string;
}

export default function ResultHeaderInput({
  classLevel,
  formControl,
  formName,
  formLabel = "Assessment Type",
  formPlaceholder = "Select Assessment Type",
}: IResultHeaderInput) {
  let {
    data: resultSettings,
    isLoading: isLoadingResultSetting,
    isError: isResultSettingError,
    error: resultSetttingError,
  } = useCustomQuery(["results"], () =>
    ResultApiService.getLevelResultSetting({
      level: decodeURIComponent(classLevel),
    }),
  );

  let resultSettingsComponents: ResultSettingComponent =
    resultSettings?.result_setting && resultSettings?.result_setting;

  return (
    <div>
      {isLoadingResultSetting ? (
        <TextLoader text="Loading assessment type" />
      ) : resultSettingsComponents && resultSettingsComponents?.flattenedComponents.length > 0 ? (
        <FormField
          control={formControl}
          name={formName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{formLabel}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="cursor-pointer rounded py-6">
                    <SelectValue placeholder={formPlaceholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="capitalize">
                  {resultSettingsComponents?.flattenedComponents
                    .filter((component) => component)
                    .map((setting) => (
                      <SelectItem
                        key={setting?.name}
                        value={setting?.name}
                        className="cursor-pointer capitalize"
                      >
                        {setting?.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : isResultSettingError ? (
        <ErrorBox error={resultSetttingError} className="w-full" />
      ) : null}
    </div>
  );
}
