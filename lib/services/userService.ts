import { supabase } from '../supabase';

export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  birth_year?: number;
  birth_month?: number;
  birth_day?: number;
  birth_hour?: number;
  birth_minute?: number;
  gender?: 'male' | 'female';
  calendar_type?: 'solar' | 'lunar' | 'lunar-leap';
  created_at?: string;
  updated_at?: string;
}

export const userService = {
  /**
   * Fetch user profile by ID
   */
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('sajulatte_users')
      .select('*')
      .eq('id', userId)
      .single();

    return { data, error };
  },

  /**
   * Upsert (Insert or Update) user profile
   */
  async upsertUser(profile: Partial<UserProfile> & { id: string }) {
    const { data, error } = await supabase
      .from('sajulatte_users')
      .upsert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create basic user if not exists (Register ID & Email)
   */
  async registerUserIfNotExists(userId: string, email?: string) {
    // Check existence first to avoid overwriting existing profile data with empty values if upsert is used carelessly
    // But safe upsert with only ID/email is fine if we don't overwrite other fields.
    // Supabase upsert merges by default if you don't unspecify columns, but usually it replaces the row.
    // So separate check is safer or use onConflict ignore if possible (but we might want to update email).

    // For now, let's just use the getProfile check we already have in logic or just simpleupsert
    // But based on existing logic, we often just want to ensure the row exists.

    const { data: existing } = await this.getUser(userId);
    if (existing) return existing;

    const { data, error } = await supabase
      .from('sajulatte_users')
      .insert({ id: userId, email, created_at: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
