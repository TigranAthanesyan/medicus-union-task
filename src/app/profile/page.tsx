"use client";

import useLoggedIn from "@/hooks/useLoggedIn";
import Profile from "@/components/Profile";

export default function ProfilePage() {
  useLoggedIn("/profile");

  return <Profile />;
}
