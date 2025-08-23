const TOKEN_KEY = 'caio@w'
const USER_KEY = 'caio'

export function login({ email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const ok = email && password && password.length >= 3
      if (ok) {
        const name = email.split('@')[0]
        const user = { email, name: capitalize(name) }
        localStorage.setItem(TOKEN_KEY, 'demo-token')
        localStorage.setItem(USER_KEY, JSON.stringify(user))
        resolve(user)
      } else {
        reject(new Error('Credenciais inválidas'))
      }
    }, 300)
  })
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY)
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function capitalize(s = '') {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
