import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { public_links } from "@/utils/nav-items";

type NavLinksProp = {
  handleMenu?: () => void;
};

const NavLinks = ({ handleMenu }: NavLinksProp) => {
  const [mainMenu, setMainMenu] = useState("");
  const pathname = usePathname();

  return (
    <>
      {public_links.map((link) => {
        return (
          <div key={link.name}>
            {/* Medium and large submenu */}
            <div className="group inline-flex flex-col text-left md:cursor-pointer">
              <Link
                href={link.href}
                className={`group flex cursor-pointer items-center gap-1.5 text-sm font-normal ${
                  pathname.includes(link.href) && "font-bold"
                }`}
                onClick={() => (mainMenu !== link.name ? setMainMenu(link.name) : setMainMenu(""))}
              >
                {link.name}
                <span className="inline text-sm md:hidden">
                  {mainMenu === link.name ? (
                    <IoIosArrowUp className="transition duration-300" />
                  ) : (
                    <IoIosArrowDown className="transition duration-300" />
                  )}
                </span>
                <span className="hidden text-sm transition duration-300 group-hover:rotate-180 md:block">
                  <IoIosArrowDown />
                </span>
              </Link>
              {link.submenu && (
                <div>
                  <div>
                    <div className="absolute top-[2rem] hidden group-hover:md:block hover:md:block">
                      <div className="bg-primary-foreground space-y-3 rounded-md px-4 pt-5 pb-4 shadow-xl">
                        {link.sublink.map((subl, i) => (
                          <li key={i} className="flex flex-col gap-1 text-sm font-normal">
                            <Link
                              href={subl.href}
                              // className="hover:underline cursor-pointer"
                              className={`cursor-pointer hover:underline ${
                                pathname.includes(subl.href) && "font-bold"
                              }`}
                            >
                              {subl.name}
                            </Link>
                          </li>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile submenu */}
            <div className={` ${mainMenu === link.name ? "mt-2 md:hidden" : "hidden"} `}>
              {/* Sublinks */}
              {link.sublink.map((subl, i) => (
                <div key={i}>
                  <div>
                    <li className="py-2 pr-5 pl-5 text-sm md:hidden md:pr-0" onClick={handleMenu}>
                      <Link href={subl.href} className="">
                        {subl.name}
                      </Link>
                    </li>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default NavLinks;
