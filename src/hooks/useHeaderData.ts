import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import useRouteData, { RoutePath as Path } from "@/hooks/useRouteData";
import BackIcon from "@/components/icons/BackIcon";
import DotsActionIcon from "@/components/icons/DotsActionIcon";
import HomeIcon from "@/components/icons/actionItemIcons/HomeIcon";
import MessageIcon from "@/components/icons/actionItemIcons/MessageIcon";
import ProfileIcon from "@/components/icons/actionItemIcons/ProfileIcon";
import LogoutIcon from "@/components/icons/actionItemIcons/LogoutIcon";
import LoginIcon from "@/components/icons/actionItemIcons/LoginIcon";
import DoctorIcon from "@/components/icons/actionItemIcons/DoctorIcon";
import ConsultationIcon from "@/components/icons/actionItemIcons/ConsultationIcon";
import { ActionIconData, ActionItemData } from "@/types";
import { APP_NAME } from "@/constants/global";

type MainContent = {
  title?: string;
  contentType?: "participant" | null;
};

type HeaderData = {
  leftAction: ActionIconData | null;
  mainContent: MainContent;
  rightAction: ActionIconData | null;
  actionItems: ActionItemData[];
};

export const useHeaderData = (onToggleSidebar?: () => void): HeaderData => {
  const router = useRouter();
  const { data: session } = useSession();
  const { path } = useRouteData();

  const actionItems: ActionItemData[] = useMemo(() => {
    const baseItems: ActionItemData[] = [];

    if (path !== Path.Home) {
      baseItems.push({
        icon: HomeIcon,
        label: 'Home',
        onClick: () => router.push('/'),
      });
    }

    if (path !== Path.Conversations && path !== Path.Conversation) {
      baseItems.push({
        icon: MessageIcon,
        label: 'Messages',
        onClick: () => router.push('/chat'),
      });
    }

    if (path !== Path.Doctors && path !== Path.Doctor) {
      baseItems.push({
        icon: DoctorIcon,
        label: 'Doctors',
        onClick: () => router.push('/doctors'),
      });
    }

    if (path !== Path.Consultations && path !== Path.Consultation) {
      baseItems.push({
        icon: ConsultationIcon,
        label: 'Consultations',
        onClick: () => router.push('/consultations'),
      });
    }

    if (path !== Path.Profile) {
      baseItems.push({
        icon: ProfileIcon,
        label: 'Profile',
        onClick: () => router.push('/profile'),
      });
    }

    if (session) {
      baseItems.push({
        icon: LogoutIcon,
        label: 'Sign Out',
        onClick: () => signOut().finally(() => router.push('/')),
      });
    } else {
      baseItems.push({
        icon: LoginIcon,
        label: 'Sign In',
        onClick: () => router.push('/auth/signin'),
      });
    }

    return baseItems;
  }, [path, session, router]);

  const goBackAction: ActionIconData = {
    icon: BackIcon,
    onClick: () => router.back(),
  };

  const openRightSidebarAction: ActionIconData = {
    icon: DotsActionIcon,
    onClick: onToggleSidebar || (() => {}),
  };

  const mainContent: MainContent = useMemo(() => {
    switch (path) {
      case Path.Conversation:
        return { contentType: "participant" };
      case Path.Conversations:
        return { title: "Messages" };
      case Path.Doctors:
        return { title: "Doctors" };
      case Path.Doctor:
        return { title: "Doctor Details" };
      case Path.Login:
        return { title: "Login" };
      case Path.SignUp:
        return { title: "Sign Up" };
      default:
        return { title: APP_NAME };
    }
  }, [path]);

  return {
    leftAction: goBackAction,
    rightAction: openRightSidebarAction,
    actionItems,
    mainContent,
  };
};
