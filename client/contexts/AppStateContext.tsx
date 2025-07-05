import React, { createContext, useContext, useReducer, useEffect } from "react";

// Siqueira Campos Imóveis - KRYONIX Technology
// Advanced State Management System

interface AppState {
  theme: "light" | "dark" | "system";
  loading: boolean;
  notifications: Notification[];
  filters: PropertyFilters;
  cache: CacheState;
  user: User | null;
  preferences: UserPreferences;
}

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actions?: NotificationAction[];
}

interface NotificationAction {
  label: string;
  action: () => void;
  type: "primary" | "secondary";
}

interface PropertyFilters {
  type: string[];
  priceRange: [number, number];
  location: string[];
  features: string[];
  sortBy: "price" | "date" | "size" | "relevance";
  sortOrder: "asc" | "desc";
}

interface CacheState {
  properties: any[];
  lastUpdate: number;
  version: string;
}

interface UserPreferences {
  language: "pt-BR" | "en" | "es";
  currency: "BRL" | "USD" | "EUR";
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    layout: "grid" | "list" | "card";
    itemsPerPage: number;
    defaultView: string;
  };
}

interface User {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  avatar?: string;
  permissions: string[];
}

type AppAction =
  | { type: "SET_THEME"; payload: AppState["theme"] }
  | { type: "SET_LOADING"; payload: boolean }
  | {
      type: "ADD_NOTIFICATION";
      payload: Omit<Notification, "id" | "timestamp">;
    }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "UPDATE_FILTERS"; payload: Partial<PropertyFilters> }
  | { type: "SET_USER"; payload: User | null }
  | { type: "UPDATE_PREFERENCES"; payload: Partial<UserPreferences> }
  | { type: "UPDATE_CACHE"; payload: Partial<CacheState> }
  | { type: "RESET_STATE" };

const initialState: AppState = {
  theme: "system",
  loading: false,
  notifications: [],
  filters: {
    type: [],
    priceRange: [0, 10000000],
    location: [],
    features: [],
    sortBy: "relevance",
    sortOrder: "desc",
  },
  cache: {
    properties: [],
    lastUpdate: 0,
    version: "1.0.0",
  },
  user: null,
  preferences: {
    language: "pt-BR",
    currency: "BRL",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    dashboard: {
      layout: "grid",
      itemsPerPage: 12,
      defaultView: "properties",
    },
  },
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.payload };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "ADD_NOTIFICATION":
      const newNotification: Notification = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        read: false,
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications].slice(0, 100), // Keep only last 100
      };

    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload,
        ),
      };

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n,
        ),
      };

    case "UPDATE_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case "SET_USER":
      return { ...state, user: action.payload };

    case "UPDATE_PREFERENCES":
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };

    case "UPDATE_CACHE":
      return {
        ...state,
        cache: { ...state.cache, ...action.payload },
      };

    case "RESET_STATE":
      return initialState;

    default:
      return state;
  }
}

const AppStateContext = createContext<
  | {
      state: AppState;
      dispatch: React.Dispatch<AppAction>;
      actions: {
        setTheme: (theme: AppState["theme"]) => void;
        setLoading: (loading: boolean) => void;
        addNotification: (
          notification: Omit<Notification, "id" | "timestamp">,
        ) => void;
        removeNotification: (id: string) => void;
        markNotificationRead: (id: string) => void;
        updateFilters: (filters: Partial<PropertyFilters>) => void;
        setUser: (user: User | null) => void;
        updatePreferences: (preferences: Partial<UserPreferences>) => void;
        updateCache: (cache: Partial<CacheState>) => void;
        resetState: () => void;
      };
    }
  | undefined
>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem("siqueira-app-state");
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Only restore preferences and filters, not sensitive data
        if (parsed.preferences) {
          dispatch({ type: "UPDATE_PREFERENCES", payload: parsed.preferences });
        }
        if (parsed.filters) {
          dispatch({ type: "UPDATE_FILTERS", payload: parsed.filters });
        }
      }
    } catch (error) {
      console.warn("Failed to load app state from localStorage:", error);
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    try {
      const stateToSave = {
        preferences: state.preferences,
        filters: state.filters,
        theme: state.theme,
      };
      localStorage.setItem("siqueira-app-state", JSON.stringify(stateToSave));
    } catch (error) {
      console.warn("Failed to save app state to localStorage:", error);
    }
  }, [state.preferences, state.filters, state.theme]);

  const actions = {
    setTheme: (theme: AppState["theme"]) =>
      dispatch({ type: "SET_THEME", payload: theme }),
    setLoading: (loading: boolean) =>
      dispatch({ type: "SET_LOADING", payload: loading }),
    addNotification: (notification: Omit<Notification, "id" | "timestamp">) =>
      dispatch({ type: "ADD_NOTIFICATION", payload: notification }),
    removeNotification: (id: string) =>
      dispatch({ type: "REMOVE_NOTIFICATION", payload: id }),
    markNotificationRead: (id: string) =>
      dispatch({ type: "MARK_NOTIFICATION_READ", payload: id }),
    updateFilters: (filters: Partial<PropertyFilters>) =>
      dispatch({ type: "UPDATE_FILTERS", payload: filters }),
    setUser: (user: User | null) =>
      dispatch({ type: "SET_USER", payload: user }),
    updatePreferences: (preferences: Partial<UserPreferences>) =>
      dispatch({ type: "UPDATE_PREFERENCES", payload: preferences }),
    updateCache: (cache: Partial<CacheState>) =>
      dispatch({ type: "UPDATE_CACHE", payload: cache }),
    resetState: () => dispatch({ type: "RESET_STATE" }),
  };

  return (
    <AppStateContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}

// Specialized hooks for different parts of the state
export function useNotifications() {
  const { state, actions } = useAppState();
  return {
    notifications: state.notifications,
    unreadCount: state.notifications.filter((n) => !n.read).length,
    addNotification: actions.addNotification,
    removeNotification: actions.removeNotification,
    markAsRead: actions.markNotificationRead,
  };
}

export function useFilters() {
  const { state, actions } = useAppState();
  return {
    filters: state.filters,
    updateFilters: actions.updateFilters,
  };
}

export function usePreferences() {
  const { state, actions } = useAppState();
  return {
    preferences: state.preferences,
    updatePreferences: actions.updatePreferences,
  };
}
