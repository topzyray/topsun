"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormLabel } from "@/components/ui/form";
import InputComponent from "../../forms/base/input-component";
import { StudentApiService } from "@/api/services/StudentApiService";
import { useAuth } from "@/api/hooks/use-auth.hook";
import ImageComponent from "../../forms/base/image-component";
import { useRouter } from "next/navigation";
import { StorageUtilsHelper } from "@/utils/storage-utils";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import { STORE_KEYS } from "@/configs/store.config";
import SubmitButton from "@/components/buttons/SubmitButton";
import { Card } from "@/components/ui/card";

const StudentOnboardingFormSchema = z.object({
  image: z
    .instanceof(File, { message: "A file is required." })
    .refine((file) => file.size > 0, { message: "File is required." }),
  home_address: z.string(),
  close_bus_stop: z.string().optional(),
  school_id: z.string().optional(),
});

export default function StudentProfileOnboardingForm() {
  const queryClient = useQueryClient();
  const { userDetails, setUserDetails } = useAuth();
  const router = useRouter();

  // console.log('STUDENT SCHOOL DATA: ', userDetails?.school);

  // let { data, isLoading, isError, error } = useCustomQuery(
  //   ["busStops"],
  //   get_bus_stops
  // );

  // let busStopData: BusStop[] =
  //   (data?.bus_stop?.addressArray !== undefined &&
  //     data?.bus_stop?.addressArray) ??
  //   [];

  const form = useForm<z.infer<typeof StudentOnboardingFormSchema>>({
    resolver: zodResolver(StudentOnboardingFormSchema),
    defaultValues: {
      home_address: "",
      // close_bus_stop: "",
      image: undefined,
    },
  });

  let { mutate: onBoardStudent, isPending: isOnBoardingStudent } = useCustomMutation(
    StudentApiService.updateStudentDetailsInASchool,
    {
      onSuccessCallback: (data) => {
        setUserDetails(data?.student);
        StorageUtilsHelper.saveToLocalStorage([STORE_KEYS.USER_DETAILS, data?.student]);
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        queryClient.invalidateQueries({ queryKey: ["classById"] });
        form.reset();
        router.replace(`/dashboard/student/overview`);
      },
      onErrorCallback(error) {
        console.log(error);
      },
    },
  );

  async function onSubmit(data: z.infer<typeof StudentOnboardingFormSchema>) {
    data = {
      ...data,
      school_id: userDetails?.school?._id as string,
    };

    const processed_data = new FormData();
    Object.keys(data).forEach((key) => {
      const value = (data as any)[key];
      if (key === "image" && value instanceof File) {
        processed_data.append("image", value);
      } else {
        processed_data.append(key, value);
      }
    });

    onBoardStudent({
      responseBody: processed_data,
      params: {
        student_id: userDetails?._id as string,
      },
    });
  }

  return (
    <Card className="mx-auto mt-6 w-full max-w-5xl rounded bg-transparent">
      <Form {...form}>
        <FormLabel className="mx-auto text-center text-lg uppercase">
          Student profile update form
        </FormLabel>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto flex w-full max-w-md flex-col space-y-4 py-6"
        >
          <ImageComponent
            formName="image"
            formControl={form.control}
            formLabel="Profle Image"
            disabled={isOnBoardingStudent}
          />

          {/* {image_data === undefined || !(image_data instanceof File) ? (
              <FormLabel>No image</FormLabel>
            ) : (
              <div>
                <div className="w-20 h-20">
                  <Image
                    src={URL.createObjectURL(image_data)}
                    alt="Image preview"
                    width={80}
                    height={80}
                    className="w-full h-full rounded-full"
                  />
                </div>
              </div>
            )} */}

          <InputComponent
            formName="home_address"
            formControl={form.control}
            formLabel="Home Address"
            formInputType="text"
            disabled={isOnBoardingStudent}
          />

          {/* <ComboboxComponent
                formName="close_bus_stop"
                formControl={form.control}
                formLabel="Enter close bus stop"
                formOptionLabel="Select bus stop"
                formOptionData={busStopData}
                formPlaceholder="Select parent"
                displayValue={(data) => `${capitalizeFirstLetter(data.street)}`}
                valueField="street"
                disabled={isOnBoardingStudent}
              /> */}

          <div className="flex gap-6">
            <SubmitButton
              disabled={!form.formState.isValid || isOnBoardingStudent}
              loading={isOnBoardingStudent}
              text="Update profile"
            />
          </div>
        </form>
      </Form>
    </Card>
  );
}
