import { useMemo } from "react";
import { usePathname } from "next/navigation";

export enum RoutePath {
  Home = 1,
  Doctors,
  Doctor,
  Conversations,
  Conversation,
  Consultations,
  Consultation,
  Profile,
  Login,
  SignUp,
}

type RouteData = {
  path: RoutePath;
};

const useRouteData = (): RouteData => {
  const pathname = usePathname();

  const path: RoutePath = useMemo(() => {
    if (pathname.startsWith("/chat/")) return RoutePath.Conversation;
    if (pathname === "/chat") return RoutePath.Conversations;
    if (pathname.startsWith("/doctors/")) return RoutePath.Doctor;
    if (pathname === "/doctors") return RoutePath.Doctors;
    if (pathname.startsWith("/consultations/")) return RoutePath.Consultation;
    if (pathname === "/consultations") return RoutePath.Consultations;
    if (pathname === "/profile") return RoutePath.Profile;
    if (pathname.startsWith("/auth/signin")) return RoutePath.Login;
    if (pathname.startsWith("/auth/signup")) return RoutePath.SignUp;
    return RoutePath.Home;
  }, [pathname]);

  return { path };
};

export default useRouteData;
