"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItems } from "../../../types";
import * as Icons from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../ui/collapsible";
import { Separator } from "../ui/separator";
import SiteLogo from "../atoms/site-logo";
import { useContext } from "react";
import { GlobalContext } from "@/providers/global-state-provider";

interface DashBoardSidebarInterface {
  navItems: NavItems;
}

export function DashBoardSidebar({ navItems }: DashBoardSidebarInterface) {
  const { isMobile, toggleSidebar } = useSidebar();
  const { activeSessionData } = useContext(GlobalContext);
  const pathname = usePathname();
  const normalize = (url: string) => url.replace(/\/+$/, "");

  const toggleSideBarOnMobile = () => {
    if (isMobile) toggleSidebar();
  };

  return (
    <Sidebar side="left" variant="floating" collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-4">
            <SiteLogo className="h-[2.5rem] w-[2.25rem]" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className="max-w-[14rem]" />
      <SidebarContent>
        <SidebarGroupLabel>Navigations</SidebarGroupLabel>

        {navItems.map((item) => {
          const DefaultIcon = Icons.HelpCircle as React.FC<React.SVGProps<SVGSVGElement>>; // Fallback icon

          const Icon =
            (Icons[item.icon as keyof typeof Icons] as React.FC<React.SVGProps<SVGSVGElement>>) ||
            DefaultIcon;
          return item.hasSubmenu ? (
            <Collapsible key={item.title} className="group/collapsible">
              <SidebarGroup className="px-0 py-0">
                <SidebarGroupLabel
                  asChild
                  className="text-text hover:bg-sidebar-accent hover:text-sidebar-accent-foreground pl-2 text-sm"
                >
                  <CollapsibleTrigger className="py-5 hover:cursor-pointer">
                    <span className="flex items-center gap-x-2">
                      {Icon && <Icon className="w-4" />}
                      {item.title}
                    </span>
                    <Icons.ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent className="mt-2 pl-2">
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.submenu != undefined &&
                        item.submenu.map((submenuItem) => {
                          const DefaultIcon = Icons.ArrowRight as React.FC<
                            React.SVGProps<SVGSVGElement>
                          >;

                          const Icon =
                            DefaultIcon ||
                            (Icons[item.icon as keyof typeof Icons] as React.FC<
                              React.SVGProps<SVGSVGElement>
                            >);

                          return (
                            <SidebarMenuItem
                              key={submenuItem.title}
                              onClick={toggleSideBarOnMobile}
                            >
                              <SidebarMenuButton
                                asChild
                                isActive={normalize(pathname).startsWith(
                                  normalize(submenuItem.url ?? ""),
                                )}
                                size="default"
                              >
                                <Link href={submenuItem.url}>
                                  {Icon && <Icon className="w-4" />}
                                  <span>{submenuItem.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ) : (
            <SidebarGroupContent key={item.title}>
              <SidebarMenu>
                {
                  <SidebarMenuItem onClick={toggleSideBarOnMobile}>
                    <SidebarMenuButton
                      asChild
                      isActive={normalize(pathname).startsWith(normalize(item.url ?? ""))}
                      size="default"
                    >
                      <Link href={item.url ? item.url : "#"}>
                        {Icon && <Icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                }
              </SidebarMenu>
            </SidebarGroupContent>
          );
        })}
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <SidebarMenu>
          {activeSessionData?.activeSession && (
            <>
              <SidebarMenuItem className="flex items-center gap-2 overflow-hidden py-2 text-sm text-ellipsis capitalize">
                <Icons.TimerIcon size={20} />
                Session: {activeSessionData?.activeSession?.academic_session}
              </SidebarMenuItem>
              <Separator />
            </>
          )}
          {activeSessionData?.activeTerm && (
            <>
              <SidebarMenuItem className="flex items-center gap-2 overflow-hidden py-2 text-sm text-ellipsis capitalize">
                <Icons.ActivityIcon size={20} />
                Term: <span>{activeSessionData?.activeTerm?.name.split("_").join(" ")}</span>
              </SidebarMenuItem>
              <Separator />
            </>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
