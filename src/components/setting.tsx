"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountDataUpdate } from "./setting-page/update-accountdata";
import { PasswordUpdate } from "./setting-page/update-password";

export function Setting({
  endpoints,
}: {
  endpoints: {
    account: string;
    password: string;
  };
}) {
  return (
    <section>
      <Tabs defaultValue="account" className="w-full max-w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <AccountDataUpdate endpoint={endpoints.account} />
        <PasswordUpdate endpoint={endpoints.password} />
      </Tabs>
    </section>
  );
}
