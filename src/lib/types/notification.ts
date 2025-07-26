export interface Notification {
  id: string;
  user_id: string;
  from_user_id?: string;
  type: 'follow' | 'like' | 'download' | 'comment' | 'mention' | 'system';
  title: string;
  message: string;
  data: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export interface NotificationData {
  follower_id?: string;
  follower_username?: string;
  follower_display_name?: string;
  rule_id?: string;
  rule_name?: string;
  download_count?: number;
  like_count?: number;
}

export interface CreateNotificationData {
  user_id: string;
  from_user_id?: string;
  type: Notification['type'];
  title: string;
  message: string;
  data?: NotificationData;
} 