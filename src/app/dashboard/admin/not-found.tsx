import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mt-10 flex h-full w-full flex-col items-center justify-center md:mt-20">
      <h2>Page Not Found</h2>
      hello
      <p>Could not find requested resource</p>
      <Link href="../" className="hover:underline">
        Go back
      </Link>
    </div>
  );
}
