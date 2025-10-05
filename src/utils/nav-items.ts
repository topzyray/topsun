import { NavItems } from "../../types";

export const super_admin_nav: NavItems = [
  {
    title: "Dashboard",
    url: "/dashboard/super_admin/overview",
    icon: "LayoutDashboard",
    hasSubmenu: false,
  },
  {
    title: "Users Management",
    icon: "UserPlus",
    hasSubmenu: true,
    submenu: [
      { title: "School Admin", url: "/dashboard/super_admin/school_admins" },
      { title: "Teachers", url: "/dashboard/super_admin/teachers" },
      { title: "Students", url: "/dashboard/super_admin/students" },
      { title: "Parents", url: "/dashboard/super_admin/parents" },
    ],
  },
  {
    title: "Academics",
    icon: "GraduationCap",
    hasSubmenu: true,
    submenu: [
      { title: "Sessions", url: "/dashboard/super_admin/sessions" },
      { title: "Subjects", url: "/dashboard/super_admin/subjects" },
      { title: "Classes", url: "/dashboard/super_admin/classes" },
      { title: "Enrollments", url: "/dashboard/super_admin/enrollments" },
      { title: "Result Setting", url: "/dashboard/super_admin/result_setting" },
      { title: "Fees", url: "/dashboard/super_admin/fees" },
    ],
  },
  {
    title: "Payments",
    icon: "Currency",
    hasSubmenu: true,
    submenu: [
      {
        title: "School Accounts",
        url: "/dashboard/super_admin/school_accounts",
      },
      { title: "Payments", url: "/dashboard/super_admin/payments" },
    ],
  },
  {
    title: "Assessments Management",
    url: "/dashboard/super_admin/cbt",
    icon: "Pen",
    hasSubmenu: false,
  },
  {
    title: "Tickets Management",
    url: "/dashboard/super_admin/tickets",
    icon: "Help",
    hasSubmenu: false,
  },
  {
    title: "User Profile",
    url: "/dashboard/super_admin/profile",
    icon: "User",
    hasSubmenu: false,
  },
];

export const school_admin_nav: NavItems = [
  {
    title: "Dashboard",
    url: "/dashboard/admin/overview",
    icon: "LayoutDashboard",
    hasSubmenu: false,
  },
  {
    title: "Users Management",
    icon: "UserPlus",
    hasSubmenu: true,
    submenu: [
      { title: "Teachers", url: "/dashboard/admin/teachers" },
      { title: "Students", url: "/dashboard/admin/students" },
      { title: "Parents", url: "/dashboard/admin/parents" },
    ],
  },
  {
    title: "Academics",
    icon: "GraduationCap",
    hasSubmenu: true,
    submenu: [
      { title: "Sessions", url: "/dashboard/admin/sessions" },
      { title: "Subjects", url: "/dashboard/admin/subjects" },
      { title: "Classes", url: "/dashboard/admin/classes" },
      { title: "Enrollments", url: "/dashboard/admin/enrollments" },
      { title: "Fees", url: "/dashboard/admin/fees" },
    ],
  },
  {
    title: "Payments",
    icon: "Currency",
    hasSubmenu: true,
    submenu: [{ title: "Payments", url: "/dashboard/admin/payments" }],
  },
  {
    title: "Assessments Management",
    url: "/dashboard/admin/cbt",
    icon: "Pen",
    hasSubmenu: false,
  },
  {
    title: "Tickets Management",
    url: "/dashboard/admin/tickets",
    icon: "Help",
    hasSubmenu: false,
  },
  {
    title: "User Profile",
    url: "/dashboard/admin/profile",
    icon: "User",
    hasSubmenu: false,
  },
];

export const teaching_staff: NavItems = [
  {
    title: "Dashboard",
    url: "/dashboard/teacher/overview",
    icon: "LayoutDashboard",
  },
  {
    title: "My Classes",
    url: "/dashboard/teacher/classes",
    icon: "User",
    // submenu: [
    //   { title: "Class Schedule", url: "/dashboard/teacher/class-schedule" },
    //   { title: "Class Materials", url: "/dashboard/teacher/class-materials" },
    // ],
  },
  {
    title: "Class Managing",
    url: "/dashboard/teacher/class_managing",
    icon: "Book",
  },
  {
    title: "Assessments Management",
    url: "/dashboard/teacher/cbt",
    icon: "Pen",
    hasSubmenu: false,
  },
  {
    title: "User Profile",
    url: "/dashboard/teacher/profile",
    icon: "User",
    hasSubmenu: false,
  },
  // {
  //   title: "Attendance",
  //   url: "/dashboard/teacher/attendance",
  //   icon: "Calendar",
  // },
  // {
  //   title: "Timetables",
  //   url: "timetables",
  //   icon: "Clock",
  // },
  // {
  //   title: "Assignments",
  //   url: "/dashboard/teacher/assignments",
  //   icon: "Clock",
  // },
  // {
  //   title: "Grades",
  //   url: "grades",
  //   icon: "Book",
  // },
  // {
  //   title: "Events",
  //   url: "events",
  //   icon: "CalendarClock",
  // },
  // {
  //   title: "Announcements",
  //   url: "announcements",
  //   icon: "Speaker",
  // },
  // {
  //   title: "Settings",
  //   url: "/dashboard/teacher/settings",
  //   icon: "Settings",
  // },
  // {
  //   title: "My Profile",
  //   url: "profile",
  //   icon: "User",
  // },
];

export const parent: NavItems = [
  {
    title: "Dashboard",
    url: "/dashboard/parent/overview",
    icon: "LayoutDashboard",
    hasSubmenu: false,
  },
  {
    title: "My Children",
    icon: "Baby",
    url: "/dashboard/parent/children",
    hasSubmenu: false,
  },
  {
    title: "User Profile",
    url: "/dashboard/parent/profile",
    icon: "User",
    hasSubmenu: false,
  },
  // {
  //   title: "My Children",
  //   icon: "Baby",
  //   hasSubmenu: true,
  //   submenu: [
  //     { title: "Child Profile", url: "/dashboard/parent/child-profile" },
  //     { title: "Child Attendance", url: "/dashboard/parent/child-attendance" },
  //   ],
  // },
  // {
  //   title: "Grades",
  //   url: "/dashboard/parent/grades",
  //   icon: "Score",
  // },
  // {
  //   title: "Fee Payments",
  //   url: "/dashboard/parent/payments",
  //   icon: "HandCoins",
  // },
  // {
  //   title: "Announcements",
  //   url: "/dashboard/parent/announcements",
  //   icon: "Speaker",
  // },
  // {
  //   title: "Settings",
  //   url: "/dashboard/parent/settings",
  //   icon: "Settings",
  // },
  // {
  //   title: "My Profile",
  //   url: "/dashboard/parent/profile",
  //   icon: "User",
  // },
];

export const student: NavItems = [
  {
    title: "Dashboard",
    url: "/dashboard/student/overview",
    icon: "LayoutDashboard",
    hasSubmenu: false,
  },
  {
    title: "My Results",
    url: "/dashboard/student/results",
    icon: "Table",
    hasSubmenu: false,
  },
  {
    title: "Fee Payments",
    url: "/dashboard/student/fee_payments",
    icon: "Currency",
    hasSubmenu: false,
  },
  {
    title: "Assessments",
    url: "/dashboard/student/cbt",
    icon: "Pen",
    hasSubmenu: false,
  },
  {
    title: "User Profile",
    url: "/dashboard/student/profile",
    icon: "User",
    hasSubmenu: false,
  },
  // {
  //   title: "My Classes",
  //   icon: "User",
  //   hasSubmenu: true,
  //   submenu: [
  //     { title: "Class Schedule", url: "/dashboard/student/class-schedule" },
  //     { title: "Class Materials", url: "/dashboard/student/class-materials" },
  //   ],
  // },
  // {
  //   title: "Assignments",
  //   url: "/dashboard/student/assignments",
  //   icon: "Clock",
  // },

  // {
  //   title: "Announcements",
  //   url: "/dashboard/student/announcements",
  //   icon: "Speaker",
  // },
  // {
  //   title: "Settings",
  //   url: "/dashboard/student/settings",
  //   icon: "Settings",
  // },
  // {
  //   title: "My Profile",
  //   url: "/dashboard/student/profile",
  //   icon: "User",
  // },
];

export const public_links = [
  // {
  //   name: "Administration",
  //   href: "/administration",
  //   submenu: true,
  //   sublink: [
  //     { name: "Administration", href: "/administration" },
  //     { name: "Teachers", href: "/administration/teachers" },
  //     { name: "Students", href: "/administration/students" },
  //   ],
  // },
  {
    name: "About us",
    href: "/about",
    submenu: true,
    sublink: [
      { name: "Company", href: "/about" },
      { name: "Faqs", href: "/faq" },
      { name: "Feedback", href: "/feedback" },
    ],
  },
  // {
  //   name: "Contact Us",
  //   href: "/contact-us",
  //   submenu: false,
  // },
];

export const docs_nav: NavItems = [
  {
    title: "Getting Started",
    url: "/docs/getting-started",
    icon: "LayoutDashboard",
    hasSubmenu: false,
  },
];
