export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  github_username?: string;
  twitter_username?: string;
  location?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  // Additional fields for auth user data
  email?: string;
  role?: string;
  last_sign_in_at?: string;
}

export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface UserStats {
  total_rules: number;
  total_downloads: number;
  total_likes: number;
  followers_count: number;
  following_count: number;
}

export interface PublicUserProfile extends UserProfile {
  stats: UserStats;
  is_following?: boolean;
}

export interface CreateProfileData {
  username: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  github_username?: string;
  twitter_username?: string;
  location?: string;
  is_public?: boolean;
}

export interface UpdateProfileData extends Partial<CreateProfileData> {
  id: string;
} 