import { DoctorCardDTO, SpecializationDTO, UserDTO } from "../types";
import { ConversationSummary, ConversationDTO, MessageDTO } from "../types/chat";

export interface State {
  doctors: DoctorCardDTO[];
  doctorMapById: Record<string, UserDTO>;
  specializations: SpecializationDTO[];

  conversations: ConversationSummary[];
  conversationsLoading: boolean;
  activeConversationId: string | null;
  activeConversation: ConversationDTO | null;
  messages: MessageDTO[];

  newMessageContent: string;
  totalUnreadCount: number;

  setDoctors: (doctors: DoctorCardDTO[]) => void;
  setDoctor: (doctor: UserDTO) => void;
  setSpecializations: (specializations: SpecializationDTO[]) => void;

  setConversations: (conversations: ConversationSummary[]) => void;
  setConversationsLoading: (loading: boolean) => void;
  addConversation: (conversation: ConversationSummary) => void;
  updateConversationUnread: (conversationId: string, count: number) => void;

  setActiveConversation: (conversationId: string | null, conversation?: ConversationDTO | null) => void;
  setMessages: (messages: MessageDTO[]) => void;
  addMessage: (message: MessageDTO) => void;
  updateMessageStatus: (messageId: string, status: string) => void; // Unused yet

  setNewMessageContent: (content: string) => void;
  updateTotalUnreadCount: () => void;
}
