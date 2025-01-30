import { cookies } from "next/headers";
import Campers from "@/components/features/Campers";
import LoginPage from "@/components/features/LoginPage";

export default async function Home() {
  const token = (await cookies()).get('token')?.value;

  if (token) {
    return <Campers />
  }

  return <LoginPage />
}
