import { useMemo } from "react";
import { usePathname } from "next/navigation";

export enum RoutePath {
  Home = 1,
  Doctors,
  Doctor,
  Patient,
  Conversations,
  Conversation,
  Profile,
  Login,
  SignUp,
}

type RouteData = {
  path: RoutePath;
}

const useRouteData = (): RouteData => {
  const pathname = usePathname();

  const path: RoutePath = useMemo(() => {
    if (pathname.startsWith('/chat/')) return RoutePath.Conversation;
    if (pathname === '/chat') return RoutePath.Conversations;
    if (pathname.startsWith('/doctors/')) return RoutePath.Doctor;
    if (pathname === '/doctors') return RoutePath.Doctors;
    if (pathname.startsWith('/patients/')) return RoutePath.Patient;
    if (pathname === '/profile') return RoutePath.Profile;
    if (pathname === '/login') return RoutePath.Login;
    if (pathname === '/signup') return RoutePath.SignUp;
    return RoutePath.Home;
  }, [pathname]);

  return { path };
}

export default useRouteData;
