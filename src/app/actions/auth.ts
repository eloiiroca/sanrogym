"use server";

import { login as authLogin, logout as authLogout } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;

  const success = await authLogin(password);

  if (success) {
    revalidatePath("/");
    redirect("/");
  } else {
    return { error: "Invalid password" };
  }
}

export async function logoutAction() {
  await authLogout();
  revalidatePath("/");
  redirect("/");
}
