import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  X,
  Check,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Settings,
  Filter,
  MoreVertical,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/contexts/AppStateContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const notificationIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const notificationColors = {
  success: "text-green-600 bg-green-50 border-green-200",
  error: "text-red-600 bg-red-50 border-red-200",
  warning: "text-yellow-600 bg-yellow-50 border-yellow-200",
  info: "text-blue-600 bg-blue-50 border-blue-200",
};

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, removeNotification } =
    useNotifications();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isOpen, setIsOpen] = useState(false);

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    return true;
  });

  const markAllAsRead = () => {
    notifications.filter((n) => !n.read).forEach((n) => markAsRead(n.id));
  };

  const clearAll = () => {
    notifications.forEach((n) => removeNotification(n.id));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-96 sm:w-96">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount}</Badge>
              )}
            </SheetTitle>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={markAllAsRead}>
                  <Check className="h-4 w-4 mr-2" />
                  Marcar todas como lidas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clearAll}>
                  <X className="h-4 w-4 mr-2" />
                  Limpar todas
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <SheetDescription>
            Acompanhe todas as atualizações importantes do sistema
          </SheetDescription>

          <div className="flex gap-2 mt-4">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Todas ({notifications.length})
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unread")}
            >
              Não lidas ({unreadCount})
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="mt-6 h-[calc(100vh-200px)]">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma notificação encontrada</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const Icon = notificationIcons[notification.type];
                const colorClass = notificationColors[notification.type];

                return (
                  <Card
                    key={notification.id}
                    className={`transition-all hover:shadow-md cursor-pointer ${
                      !notification.read ? "border-l-4 border-l-primary" : ""
                    }`}
                    onClick={() =>
                      !notification.read && markAsRead(notification.id)
                    }
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded-full ${colorClass}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <CardTitle className="text-sm font-medium">
                            {notification.title}
                          </CardTitle>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(notification.timestamp),
                            {
                              addSuffix: true,
                              locale: ptBR,
                            },
                          )}
                        </span>

                        {notification.actions && (
                          <div className="flex gap-1">
                            {notification.actions.map((action, index) => (
                              <Button
                                key={index}
                                variant={
                                  action.type === "primary"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.action();
                                }}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
