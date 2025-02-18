  import { create } from 'zustand';
  import supabase from '@/utils/supabase';

  const useUserStore = create((set) => {
    const storedUserId = JSON.parse(localStorage.getItem('userId'));
    const loggedInUserId = storedUserId ? storedUserId : null;

    return {
      userId: loggedInUserId,

      login: (userId) => {
        set({ userId });
        localStorage.setItem('userId', JSON.stringify(userId));
      },

      logout: () => {
        set({ userId: null });
        localStorage.removeItem('userId');
      },

      fetchUser: async (email) => {
        try {
          const { data: user, error } = await supabase
            .from('user')
            .select('*')
            .eq('email', email)
            .single();

          if (error) throw error;

          return user;
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      },
    }
  })

  export default useUserStore;
