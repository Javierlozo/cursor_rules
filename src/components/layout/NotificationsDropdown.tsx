"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Notification } from "@/lib/types/notification";
import { FiBell, FiUsers, FiHeart, FiMessageSquare, FiAtSign, FiSettings, FiCheck } from "react-icons/fi";
import Link from "next/link";

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationUpdate?: () => void;
}

export default function NotificationsDropdown({ isOpen, onClose, onNotificationUpdate }: NotificationsDropdownProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications();
    }
  }, [isOpen, user]);

  const fetchNotifications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // First check if notifications table exists using a simple query
      let notificationsExist = false;
      try {
        const { data: testQuery } = await supabase
          .from("notifications")
          .select("id")
          .limit(1);
        notificationsExist = true;
      } catch (error) {
        // Table doesn't exist or not accessible
        notificationsExist = false;
      }

      if (!notificationsExist) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      setNotifications(data || []);
      
      // Get unread count using direct query
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
      
      setUnreadCount(count || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
        .eq("user_id", user.id);

      if (!error) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, is_read: true }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        onNotificationUpdate?.(); // Refresh header count
      } else {
        console.warn("Error marking notification as read:", error);
      }
    } catch (error) {
      console.warn("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (!error) {
        setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
        setUnreadCount(0);
        onNotificationUpdate?.(); // Refresh header count
      } else {
        console.warn("Error marking all notifications as read:", error);
      }
    } catch (error) {
      console.warn("Error marking all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'follow':
        return <FiUsers className="w-4 h-4 text-blue-400" />;
      case 'like':
        return <FiHeart className="w-4 h-4 text-red-400" />;
      case 'download':
        return <FiMessageSquare className="w-4 h-4 text-green-400" />;
      case 'comment':
        return <FiMessageSquare className="w-4 h-4 text-purple-400" />;
      case 'mention':
        return <FiAtSign className="w-4 h-4 text-orange-400" />;
      case 'system':
        return <FiSettings className="w-4 h-4 text-gray-400" />;
      default:
        return <FiBell className="w-4 h-4 text-gray-400" />;
    }
  };

  const getNotificationLink = (notification: Notification) => {
    switch (notification.type) {
      case 'follow':
        return `/profile/${notification.data?.follower_username}`;
      case 'like':
      case 'download':
      case 'system':
        return notification.data?.rule_id ? `/cursor-rules/${notification.data.rule_id}` : '#';
      default:
        return '#';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-400 hover:text-blue-300 transition"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-400 text-sm">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center">
            <FiBell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-700/50 transition ${
                  !notification.is_read ? 'bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">
                        {notification.title}
                      </p>
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-blue-400 hover:text-blue-300 transition"
                        >
                          <FiCheck className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                    {getNotificationLink(notification) !== '#' && (
                      <Link
                        href={getNotificationLink(notification)}
                        className="text-xs text-blue-400 hover:text-blue-300 transition mt-2 inline-block"
                        onClick={onClose}
                      >
                        View →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-4 border-t border-gray-700">
          <Link
            href="/notifications"
            className="text-sm text-blue-400 hover:text-blue-300 transition block text-center"
            onClick={onClose}
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
} 