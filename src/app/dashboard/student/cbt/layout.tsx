"use client";

import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { CbtApiService } from "@/api/services/CbtApiService";
import { ClassExamTimetable, Student } from "../../../../../types";
import { useContext, useEffect } from "react";
import { GlobalContext } from "@/providers/global-state-provider";
import { StorageUtilsHelper } from "@/utils/storage-utils";
import { STORE_KEYS } from "@/configs/store.config";

export default function StudentCBTLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { activeSessionData, setExamTimetable } = useContext(GlobalContext);
  const { userDetails } = useAuth();
  const student = (userDetails as Student) ?? {};

  let { data, isLoading, isError, error } = useCustomQuery(
    ["timetable"],
    () =>
      CbtApiService.getTermClassExamTimetable({
        academic_session_id: activeSessionData?.activeSession?._id as string,
        class_id: student?.current_class?.class_id?._id,
        term: activeSessionData?.activeTerm?.name as string,
      }),
    {},
    activeSessionData?.activeSession?._id !== undefined ||
      activeSessionData?.activeTerm?.name !== undefined,
  );

  const classTimetable: ClassExamTimetable = data?.timetable != undefined && data?.timetable;
  data = data?.timetable != undefined && data?.timetable;

  useEffect(() => {
    if (isLoading) {
      setExamTimetable((prev) => ({
        ...prev,
        loading: isLoading,
      }));
    } else if (classTimetable) {
      StorageUtilsHelper.saveToLocalStorage([
        STORE_KEYS.EXAM_TIMETABLE,
        {
          data: classTimetable,
        },
      ]);
      setExamTimetable((prev) => ({
        ...prev,
        data: classTimetable,
        loading: false,
        error: null,
      }));
    } else if (isError) {
      setExamTimetable((prev) => ({
        ...prev,
        error: error,
        loading: false,
        data: null,
      }));
    }
  }, [classTimetable, isLoading, isError, error, setExamTimetable]);

  return <>{children}</>;
}

// export default function StudentCBTLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const { activeSessionData, setExamTimetable } = useContext(GlobalContext);
//   const { userDetails, schoolDetails } = useAuth();
//   const student = (userDetails as Student) ?? {};

//   let { data, isLoading, isError, error } = useCustomQuery(
//     ["timetable"],
//     () =>
//       CbtApiService.getTermClassExamTimetable({
//         academic_session_id: activeSessionData?.activeSession?._id as string,
//         class_id: student?.current_class?.class_id?._id,
//         term: activeSessionData?.activeTerm?.name as string,
//       }),
//     {},
//     activeSessionData?.activeSession?._id !== undefined ||
//       activeSessionData?.activeTerm?.name !== undefined
//   );

//   const classTimetable: ClassExamTimetable =
//     data?.timetable != undefined && data?.timetable;
//   data = data?.timetable != undefined && data?.timetable;

//   useEffect(() => {
//     if (isLoading) {
//       setExamTimetable((prev) => ({
//         ...prev,
//         loading: isLoading,
//       }));
//     } else if (classTimetable) {
//       StorageUtilsHelper.saveToLocalStorage([
//         STORE_KEYS.EXAM_TIMETABLE,
//         {
//           data: classTimetable,
//         },
//       ]);
//       setExamTimetable((prev) => ({
//         ...prev,
//         data: classTimetable,
//         loading: false,
//         error: null,
//       }));
//     } else if (isError) {
//       setExamTimetable((prev) => ({
//         ...prev,
//         error: error,
//         loading: false,
//         data: null,
//       }));
//     }
//   }, [classTimetable, isLoading, isError, error, setExamTimetable]);

//   <FeatureGateWrapper
//     plan={schoolDetails?.subscription?.plan as SubscriptionPlanTypeEnum}
//     userRole={userDetails?.role as UserRole}
//     schoolDetails={schoolDetails}
//     feature={
//       SchoolFeaturesEnum.OBJECTIVE_EXAM || SchoolFeaturesEnum.THEORY_EXAM
//     }
//   >
//     {children}
//   </FeatureGateWrapper>;
// }
