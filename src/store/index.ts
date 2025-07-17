import { create } from 'zustand';
import { State } from './types';
import { MessageStatus } from '../types/chat';

export const useStore = create<State>((set, get) => ({
  doctors: [],
  doctorMapById: {},
  specializations: [],
  
  conversations: [],
  conversationsLoading: false,
  activeConversationId: null,
  activeConversation: null,
  messages: [],
  messagesLoading: false,
  
  chatListOpen: false,
  newMessageContent: '',
  totalUnreadCount: 0,
  
  setDoctors: (doctors) => set({ doctors }),

  setDoctor: (doctor) => {
    const { doctorMapById } = get();
    set({ 
      doctorMapById: {
        ...doctorMapById,
        [doctor.id]: doctor
      }
    });
  },
  setSpecializations: (specializations) => set({ specializations }),
  
  setConversations: (conversations) => {
    set({ conversations });
    get().updateTotalUnreadCount();
  },
  
  setConversationsLoading: (loading) => set({ conversationsLoading: loading }),
  
  addConversation: (conversation) => {
    const { conversations } = get();
    set({ conversations: [conversation, ...conversations] });
    get().updateTotalUnreadCount();
  },
  
  updateConversationUnread: (conversationId, count) => {
    const { conversations } = get();
    const updatedConversations = conversations.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: count } : conv
    );
    set({ conversations: updatedConversations });
    get().updateTotalUnreadCount();
  },
  
  setActiveConversation: (conversationId, conversation = null) => {
    set({ 
      activeConversationId: conversationId,
      activeConversation: conversation,
      messages: [],
      newMessageContent: '',
    });
  },
  
  setMessages: (messages) => set({ messages }),
  
  setMessagesLoading: (loading) => set({ messagesLoading: loading }),
  
  addMessage: (message) => {
    const { messages } = get();
    set({ messages: [...messages, message] });
    
    const { conversations, activeConversationId } = get();
    if (activeConversationId) {
      const updatedConversations = conversations.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            lastMessage: {
              content: message.content,
              timestamp: message.createdAt,
              sender: message.sender
            }
          };
        }
        return conv;
      });
      set({ conversations: updatedConversations });
    }
  },
  
  updateMessageStatus: (messageId, status) => {
    const { messages } = get();
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, status: status as MessageStatus } : msg
    );
    set({ messages: updatedMessages });
  },
  
  setChatListOpen: (open) => set({ chatListOpen: open }),
  
  setNewMessageContent: (content) => set({ newMessageContent: content }),
  
  updateTotalUnreadCount: () => {
    const { conversations } = get();
    const total = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    set({ totalUnreadCount: total });
  },
})); 