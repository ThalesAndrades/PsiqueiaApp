import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id: string;
  auth_user_id: string;
  name: string;
  email: string;
  user_type: 'patient' | 'psychologist';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  profile: UserProfile | null;
}

export const authService = {
  // Login
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  // Cadastro
  async signUp(email: string, password: string, name: string, userType: 'patient' | 'psychologist') {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          user_type: userType,
        }
      }
    });

    if (error) throw error;

    // Criar perfil do usuário
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users_profile')
        .insert({
          auth_user_id: data.user.id,
          name,
          email,
          user_type: userType,
        });

      if (profileError) throw profileError;
    }

    return data;
  },

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Obter usuário atual
  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile } = await supabase
      .from('users_profile')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email!,
      profile,
    };
  },

  // Atualizar perfil
  async updateProfile(updates: Partial<UserProfile>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('users_profile')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('auth_user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Listener para mudanças de auth
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const authUser = await this.getCurrentUser();
        callback(authUser);
      } else {
        callback(null);
      }
    });
  }
};