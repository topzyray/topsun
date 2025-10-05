import { Setting } from "@/components/setting";

export default function SettingsPage() {
  let endpoints = {
    account: "/api/user/account",
    password: "/api/user/password",
  };
  return (
    <section className="w-full overflow-y-hidden">
      <Setting endpoints={endpoints} />
    </section>
  );
}
