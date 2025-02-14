import { cookies } from "next/headers";
import HomePage from "@/components/features/Home";
import LoginPage from "@/components/features/LoginPage";

export default async function Home() {
  const token = (await cookies()).get('token')?.value;
  
  return (
    <main className="flex items-center justify-center">
      {token ? <HomePage /> : <LoginPage />}
    </main>
  );
}