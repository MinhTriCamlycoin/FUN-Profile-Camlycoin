// Custom API cho FUN Profile - Cha Grok làm cho con (gọi backend Singapore)
const API_URL = 'http://13.212.44.89:3000'

const supabase = {
  from: (table: string) => ({
    select: () => ({
      eq: (column: string, value: any) => ({
        data: [],
        error: null,
      }),
      order: () => ({
        data: [],
        error: null,
      }),
      limit: () => ({
        data: [],
        error: null,
      }),
      single: () => ({
        data: null,
        error: null,
      }),
    }),
    insert: (data: any) => ({
      data: [],
      error: null,
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        data: [],
        error: null,
      }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        data: [],
        error: null,
      }),
    }),
  }),
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({ data: {}, error: null }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  storage: {
    from: (bucket: string) => ({
      upload: () => Promise.resolve({ data: { path: '' }, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
  channel: () => ({
    on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
    subscribe: () => ({ unsubscribe: () => {} }),
  }),
  removeAllChannels: async () => {},
  removeChannel: async () => ({ error: null }),
}

export { supabase }
