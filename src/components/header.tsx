"use client";

import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useContext } from "react";
import { GlobalContext } from "../providers/global-state-provider";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./atoms/mode-toggle";
import { Button } from "./ui/button";
import Image from "next/image";
import { useAuth } from "@/api/hooks/use-auth.hook";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import * as Icons from "lucide-react";
import { TextHelper } from "@/helpers/TextHelper";
import SiteLogo from "./atoms/site-logo";

const Header = () => {
  const { showNavModal, setShowNavModal } = useContext(GlobalContext);
  const { logout, userDetails } = useAuth();

  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="bg-primary-foreground sticky top-0 z-40 flex items-center justify-between px-4 py-1.5 lg:px-[5rem]">
      <SiteLogo onClick={() => setShowNavModal(false)} />

      <div className="flex items-center gap-1.5 md:hidden">
        <ThemeToggle />

        <div
          onClick={() => setShowNavModal(!showNavModal)}
          className="hover:bg-primary cursor-pointer items-center justify-center hover:rounded-lg"
        >
          {!showNavModal ? (
            <AiOutlineMenu size={40} className="" />
          ) : (
            <AiOutlineClose className="p-1 hover:rounded-lg" size={40} />
          )}
        </div>
      </div>

      <div className="hidden items-center justify-end gap-5 md:flex lg:gap-8">
        {/* Medium and Large screen nav */}
        <ul className="flex items-center gap-5 lg:gap-8">
          <li className="group relative cursor-pointer text-lg font-normal sm:text-xl">
            <Link
              href="/"
              className={`inline-flex flex-col items-center hover:underline ${
                pathname === "/" && "font-bold"
              }`}
            >
              Home
            </Link>
          </li>
          <li className="group relative cursor-pointer text-lg font-normal sm:text-xl">
            <Link
              href="/about-us"
              className={`inline-flex flex-col items-center hover:underline ${
                pathname === "/about-us" && "font-bold"
              }`}
            >
              About Us
            </Link>
          </li>
          <li className="group relative cursor-pointer text-lg font-normal sm:text-xl">
            <Link
              href="/faq"
              className={`inline-flex flex-col items-center hover:underline ${
                pathname === "/faq" && "font-bold"
              }`}
            >
              Faq
            </Link>
          </li>
          <li className="group relative cursor-pointer text-lg font-normal sm:text-xl">
            <Link
              href="/contact-us"
              className={`inline-flex flex-col items-center hover:underline ${
                pathname === "/contact-us" && "font-bold"
              }`}
            >
              Contact Us
            </Link>
          </li>
          {/* <TooltipComponent
            trigger={
              <li className="text-lg sm:text-xl font-normal cursor-not-allowed group relative">
                CBT Exams
              </li>
            }
            message={<span>Coming Soon!</span>}
          /> */}
        </ul>

        {/* Medium and large screen */}
        <nav className="flex items-center">
          {userDetails ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="cursor-pointer hover:shadow">
                  {userDetails && userDetails !== null && userDetails.profile_image ? (
                    <Image
                      src={userDetails?.profile_image?.url as string}
                      alt={userDetails.first_name}
                      width={35}
                      height={35}
                      className="border-primary rounded-full border"
                    />
                  ) : (
                    <Icons.CircleUserRound size={35} />
                  )}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem
                  onClick={() => router.push(`/dashboard/${userDetails.role}/overview`)}
                  className="text-lg"
                >
                  {userDetails && userDetails !== null && userDetails.profile_image ? (
                    <Image
                      src={userDetails?.profile_image?.url as string}
                      alt={userDetails.first_name}
                      width={35}
                      height={35}
                      className="rounded-full"
                    />
                  ) : (
                    <Icons.CircleUserRound size={35} />
                  )}{" "}
                  {userDetails &&
                    userDetails !== null &&
                    `${TextHelper.capitalize(userDetails?.first_name)}`}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-lg text-red-600">
                  <Icons.LogOutIcon /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex md:gap-2 lg:gap-4">
              <Link href="get-started">
                <Button>Get Started</Button>
              </Link>
              {/* <SchoolRedirectBanner /> */}
              {/* <Link href="login">
              <Button>Login</Button>
            </Link> */}
            </div>
          )}

          <div className="ml-4">
            <ThemeToggle />
          </div>
        </nav>
      </div>

      {showNavModal && (
        <div
          onClick={() => setShowNavModal(false)}
          className={
            showNavModal
              ? `absolute top-[5.2rem] left-0 h-screen w-full overflow-y-auto bg-black/70 shadow-xl backdrop-blur-none duration-500 ease-in md:hidden`
              : `left-[-100%] duration-500 ease-out`
          }
        >
          <ul
            onClick={(e) => e.stopPropagation()}
            className="bg-primary-foreground flex h-full max-w-[13rem] flex-col space-y-4 px-8 py-8"
          >
            <div className="flex flex-col justify-between gap-10">
              <div className="space-y-6">
                <li onClick={() => setShowNavModal(false)}>
                  <Link
                    href="/"
                    className={`inline-flex cursor-pointer text-xl hover:underline ${
                      pathname === "/" && "font-bold"
                    }`}
                  >
                    Home
                  </Link>
                </li>
                <li onClick={() => setShowNavModal(false)}>
                  <Link
                    href="/about-us"
                    className={`inline-flex cursor-pointer text-xl hover:underline ${
                      pathname === "/about-us" && "font-bold"
                    }`}
                  >
                    About Us
                  </Link>
                </li>
                <li onClick={() => setShowNavModal(false)}>
                  <Link
                    href="/faq"
                    className={`inline-flex cursor-pointer text-xl hover:underline ${
                      pathname === "/faq" && "font-bold"
                    }`}
                  >
                    Faq
                  </Link>
                </li>
                <li onClick={() => setShowNavModal(false)}>
                  <Link
                    href="/contact-us"
                    className={`inline-flex cursor-pointer text-xl hover:underline ${
                      pathname === "/contact-us" && "font-bold"
                    }`}
                  >
                    Contact Us
                  </Link>
                </li>
                {/* <TooltipComponent
                  trigger={
                    <li className="text-lg sm:text-xl font-normal cursor-not-allowed group relative">
                      CBT Exams
                    </li>
                  }
                  message={<span>Coming Soon!</span>}
                /> */}
                <div className="pt-1">
                  <nav className="flex items-center md:hidden">
                    {userDetails ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <span className="cursor-pointer hover:shadow">
                            {userDetails && userDetails !== null && userDetails.profile_image ? (
                              <Image
                                src={userDetails?.profile_image?.url as string}
                                alt={userDetails.first_name}
                                width={35}
                                height={35}
                                className="rounded-full"
                              />
                            ) : (
                              <Icons.CircleUserRound size={35} />
                            )}
                          </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          side="right"
                          className="w-[--radix-popper-anchor-width]"
                        >
                          <DropdownMenuItem
                            onClick={() => {
                              router.push(`/dashboard/${userDetails.role}/overview`);
                              setShowNavModal(false);
                            }}
                            className="text-lg"
                          >
                            {userDetails && userDetails !== null && userDetails.profile_image ? (
                              <Image
                                src={userDetails?.profile_image?.url as string}
                                alt={userDetails.first_name}
                                width={35}
                                height={35}
                                className="rounded-full"
                              />
                            ) : (
                              <Icons.CircleUserRound size={35} />
                            )}{" "}
                            {userDetails &&
                              userDetails !== null &&
                              `${TextHelper.capitalize(userDetails?.first_name)}`}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setShowNavModal(false);
                              logout();
                            }}
                            className="text-lg text-red-600"
                          >
                            <Icons.LogOutIcon /> Logout
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <div className="space-y-2">
                        {/* <Link href="login" className="block">
                          <Button
                            onClick={() => setShowNavModal(false)}
                            className="btn btn-primary"
                          >
                            Login
                          </Button>
                        </Link> */}
                        <Link href="/get-started" className="block">
                          <Button onClick={() => setShowNavModal(false)}>Get Started</Button>
                        </Link>
                      </div>
                    )}
                  </nav>
                </div>
              </div>
            </div>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
