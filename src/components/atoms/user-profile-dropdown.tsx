"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuButton } from "../ui/sidebar";
import Image from "next/image";
import {
  ChevronDown,
  CircleUserRound,
  HelpCircle,
  LogOutIcon,
  LucideMail,
  Settings,
  UserCircle,
} from "lucide-react";
import { TextHelper } from "@/helpers/TextHelper";
import TooltipComponent from "../info/tool-tip";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { User } from "../../../types";
import { useRouter } from "next/navigation";

export default function UserProfileDropdown({ userData }: { userData: User }) {
  const { logout } = useAuth();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton variant="default" size="default" className="py-4">
          {userData && userData !== null && userData.profile_image ? (
            <Image
              src={userData?.profile_image?.url as string}
              alt={userData.first_name}
              width={30}
              height={30}
              className="h-6 w-6 rounded-full"
            />
          ) : (
            <CircleUserRound size={35} className="text-primary" />
          )}
          <span className="hidden sm:block">
            {TextHelper.capitalize(userData?.first_name as string)}
          </span>
          <ChevronDown className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="w-full min-w-sm space-y-2 p-4">
        <DropdownMenuItem className="text-sm">
          {userData && userData !== null && userData.profile_image ? (
            <Image
              src={userData?.profile_image?.url as string}
              alt={userData.first_name}
              width={35}
              height={35}
              className="h-6 w-6 rounded-full"
            />
          ) : (
            <CircleUserRound size={35} className="text-primary" />
          )}{" "}
          {userData &&
            userData !== null &&
            `${TextHelper.capitalize(
              userData?.first_name,
            )} ${TextHelper.capitalize(userData?.last_name)}`}
        </DropdownMenuItem>
        <TooltipComponent
          trigger={
            <DropdownMenuItem className="overflow-hidden py-2 text-sm text-ellipsis">
              <LucideMail /> {userData && userData !== null && userData.email}
            </DropdownMenuItem>
          }
          message={<span>{userData && userData !== null && userData.email}</span>}
        />
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/${userData?.role}/profile`)}
          className="py-2 text-sm"
        >
          <UserCircle /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2 text-sm">
          <Settings /> Settings
        </DropdownMenuItem>
        {/* <DropdownMenuItem className="py-2 text-sm">
          <Ticket /> Raise a ticket
        </DropdownMenuItem> */}
        <DropdownMenuItem className="py-2 text-sm">
          <HelpCircle /> Help & Support
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} className="py-2 text-sm text-red-600">
          <LogOutIcon /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
