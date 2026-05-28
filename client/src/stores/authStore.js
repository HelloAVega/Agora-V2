import create from 'zustand'

const TOKEN_KEY = 'agora_token'
const USER_KEY = 'agora_user'

function loadInitial() {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const userJson = localStorage.getItem(USER_KEY)
    const user = userJson ? JSON.parse(userJson) : null
    return { token: token || null, user }
  } catch (e) {
    return { token: null, user: null }
  }
}

export const useAuthStore = create((set) => ({
  ...loadInitial(),
  setAuth: (token, user) => {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token)
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    } catch (e) {
      // ignore localStorage errors
    }
    set({ token, user })
  },
  updateUser: (user) => {
    try {
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    } catch (e) {}
    set({ user })
  },
  logout: () => {
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    } catch (e) {}
    set({ token: null, user: null })
  },
}))
