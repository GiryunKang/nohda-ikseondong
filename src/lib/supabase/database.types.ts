export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          category: string;
          content: string;
          excerpt: string | null;
          status: "draft" | "review" | "published" | "archived";
          cover_image_url: string | null;
          published_at: string | null;
          updated_at: string | null;
          created_at: string;
          view_count: number;
          author_id: string;
          is_ai_generated: boolean;
          sns_summary_x: string | null;
          sns_summary_instagram: string | null;
          sns_hashtags: string[] | null;
        };
        Insert: Omit<Database["public"]["Tables"]["articles"]["Row"], "id" | "created_at" | "view_count"> & {
          id?: string;
          created_at?: string;
          view_count?: number;
        };
        Update: Partial<Database["public"]["Tables"]["articles"]["Row"]>;
      };
      places: {
        Row: {
          id: string;
          name: string;
          category: "restaurant" | "cafe" | "culture" | "course" | "event" | "locker_tip" | "story";
          address: string | null;
          phone: string | null;
          latitude: number | null;
          longitude: number | null;
          rating: number | null;
          review_count: number;
          source: string;
          source_id: string;
          image_url: string | null;
          description: string | null;
          tags: string[];
          is_featured: boolean;
          crawled_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["places"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["places"]["Row"]>;
      };
      admin_profiles: {
        Row: {
          id: string;
          name: string;
          role: "admin" | "super_admin";
        };
        Insert: Database["public"]["Tables"]["admin_profiles"]["Row"];
        Update: Partial<Database["public"]["Tables"]["admin_profiles"]["Row"]>;
      };
      sns_posts: {
        Row: {
          id: string;
          article_id: string;
          platform: "x" | "instagram";
          status: "published" | "failed";
          post_url: string | null;
          error_message: string | null;
          published_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["sns_posts"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sns_posts"]["Row"]>;
      };
    };
    Functions: {
      increment_article_view: {
        Args: { article_id: string };
        Returns: void;
      };
    };
  };
}
