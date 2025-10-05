"use client";

import { createContext, useState } from "react";
import { ClassExamTimetable, ClassLevel, GlobalContextType, Session, Term } from "../../types";
import { useTheme } from "next-themes";
import Cookies from "js-cookie";
import ServiceWorkderRegistrar from "./service-worker";

export const GlobalContext = createContext({} as GlobalContextType);

export const GlobalProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [showNavModal, setShowNavModal] = useState<boolean>(false);
  const [showEvent, setShowEvent] = useState<boolean>(false);
  const [activeSessionData, setActiveSessionData] = useState<{
    activeSession: Session | null;
    activeTerm: Term | null;
    loading: boolean;
    error: Error | null;
  }>({
    activeSession: null,
    activeTerm: null,
    loading: false,
    error: null,
  });
  const [classLevel, setClassLevel] = useState<{
    loading: boolean;
    data: ClassLevel | null;
    error: Error | null;
  }>({
    loading: false,
    data: null,
    error: null,
  });
  const [examTimetable, setExamTimetable] = useState<{
    loading: boolean;
    data: ClassExamTimetable | null;
    error: Error | null;
  }>({
    loading: false,
    data: null,
    error: null,
  });
  const [pageLevelLoader, setPageLevelLoader] = useState<boolean>(false);
  const [componentLevelLoader, setComponentLevelLoader] = useState({
    loading: false,
    id: "",
  });
  const { theme } = useTheme();
  if (theme) {
    Cookies.set("theme", theme);
  }

  return (
    <GlobalContext.Provider
      value={{
        showNavModal,
        setShowNavModal,
        showEvent,
        setShowEvent,
        activeSessionData,
        setActiveSessionData,
        classLevel,
        setClassLevel,
        examTimetable,
        setExamTimetable,
        pageLevelLoader,
        setPageLevelLoader,
        componentLevelLoader,
        setComponentLevelLoader,
      }}
    >
      <ServiceWorkderRegistrar />
      {children}
    </GlobalContext.Provider>
  );
};
