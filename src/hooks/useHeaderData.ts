import { useMemo } from "react";
import { useRouter } from "next/navigation";
import useRouteData, { RoutePath as Path } from "./useRouteData";
import BackIcon from "@/components/icons/BackIcon";
import HomeIcon from "@/components/icons/HomeIcon";
import DotsActionIcon from "@/components/icons/DotsActionIcon";
import { ActionIconData } from "@/types";
import { APP_NAME } from "@/constants/global";

type MainContent = {
  title?: string;
  contentType?: 'participant' | null;
}

type HeaderData = {
  leftAction: ActionIconData | null;
  mainContent: MainContent;
  rightAction: ActionIconData | null;
}

export const useHeaderData = (): HeaderData => {
  const router = useRouter();
  const { path } = useRouteData();

  const goBackAction: ActionIconData = {
    icon: BackIcon,
    onClick: () => router.back(),
  };

  const goHomeAction: ActionIconData = {
    icon: HomeIcon,
    onClick: () => router.push('/'),
  };

  const goBackToChatsAction: ActionIconData = {
    icon: BackIcon,
    onClick: () => router.push('/chat'),
  };

  const goBackToDoctorsAction: ActionIconData = {
    icon: BackIcon,
    onClick: () => router.push('/doctors'),
  };

  const openRightSidebarAction: ActionIconData = {
    icon: DotsActionIcon,
    onClick: () => {},
  }

  const leftActionIconsMap: Record<Path, ActionIconData | null> = {
    [Path.Conversation]: goBackToChatsAction,
    [Path.Conversations]: goHomeAction,
    [Path.Home]: goHomeAction,
    [Path.Doctors]: goHomeAction,
    [Path.Doctor]: goBackToDoctorsAction,
    [Path.Patient]: goBackAction,
    [Path.Profile]: goHomeAction,
    [Path.Login]: goHomeAction,
    [Path.SignUp]: goHomeAction,
  };

  const rightActionIconsMap: Record<Path, ActionIconData | null> = {
    [Path.Conversation]: openRightSidebarAction,
    [Path.Conversations]: openRightSidebarAction,
    [Path.Home]: openRightSidebarAction,
    [Path.Doctors]: openRightSidebarAction,
    [Path.Doctor]: openRightSidebarAction,
    [Path.Patient]: openRightSidebarAction,
    [Path.Profile]: openRightSidebarAction,
    [Path.Login]: openRightSidebarAction,
    [Path.SignUp]: openRightSidebarAction,
  };

  const mainContent: MainContent = useMemo(() => {
    switch (path) {
      case Path.Conversation:
        return { contentType: 'participant' }
      case Path.Conversations:
        return { title: 'Messages' }
      case Path.Home:
        return { title: APP_NAME }
      case Path.Doctors:
        return { title: 'Doctors' }
      case Path.Doctor:
        return { title: 'Doctor Details' }
      case Path.Login:
        return { title: 'Login' }
      case Path.SignUp:
        return { title: 'Sign Up' }
      default:
        return { title: APP_NAME }
    }
  }, [path]);

  return {
    leftAction: leftActionIconsMap[path],
    rightAction: rightActionIconsMap[path],
    mainContent,
  };
};