"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { FiBell, FiCheck, FiHeart, FiUserPlus, FiMessageSquare } from "react-icons/fi";
import Link from "next/link";

interface Notification {
  id: string;
  user_id: string;
  type: 'rule_like' | 'rule_download' | 'new_follower' | 'comment' | 'system';
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, filter]);

  const fetchNotifications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (filter === 'unread') {
        query = query.eq("is_read", false);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      } else {
        setNotifications(data || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
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
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
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
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, is_read: true }))
        );
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'rule_like':
        return <FiHeart className="w-4 h-4 text-red-400" />;
              case 'rule_download':
          return <FiMessageSquare className="w-4 h-4 text-green-400" />;
      case 'new_follower':
        return <FiUserPlus className="w-4 h-4 text-blue-400" />;
      case 'comment':
        return <FiMessageSquare className="w-4 h-4 text-yellow-400" />;
      default:
        return <FiBell className="w-4 h-4 text-gray-400" />;
    }
  };

  const getNotificationLink = (notification: Notification) => {
    switch (notification.type) {
      case 'rule_like':
      case 'rule_download':
        return notification.data?.rule_id ? `/cursor-rules/${notification.data.rule_id}` : '#';
      case 'new_follower':
        return notification.data?.follower_id ? `/profile/${notification.data.follower_id}` : '#';
      case 'comment':
        return notification.data?.rule_id ? `/cursor-rules/${notification.data.rule_id}` : '#';
      default:
        return '#';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Notifications</h1>
          <p className="text-gray-400">Please sign in to view your notifications.</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="container mx-auto px-4 py-8">
              <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-center">Notifications</h1>
            <p className="text-gray-400">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All notifications</option>
              <option value="unread">Unread only</option>
            </select>
            
            {/* Mark all as read */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <FiBell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
            <p className="text-gray-400 mb-6">
              {filter === 'unread' 
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."
              }
            </p>
            <Link
              href="/cursor-rules"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Browse Rules
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition ${
                  !notification.is_read ? 'bg-blue-900/20 border-blue-700' : 'bg-gray-800'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {!notification.is_read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-400 hover:text-blue-300 transition p-1"
                            title="Mark as read"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-3">
                      {notification.message}
                    </p>
                    {getNotificationLink(notification) !== '#' && (
                      <Link
                        href={getNotificationLink(notification)}
                        className="text-blue-400 hover:text-blue-300 transition text-sm inline-flex items-center gap-1"
                      >
                        View details →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 