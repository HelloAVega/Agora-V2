async function run() {
  try {
    const base = 'http://localhost:3001'

    const hRes = await fetch(`${base}/api/health`)
    const h = await hRes.json()
    console.log('HEALTH', h)

    const regRes = await fetch(`${base}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'pass123' }),
    })
    const reg = await regRes.json()
    console.log('REGISTER', reg)

    const loginRes = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'pass123' }),
    })
    const login = await loginRes.json()
    console.log('LOGIN', login)

    if (login && login.token) {
      const meRes = await fetch(`${base}/api/auth/me`, { headers: { Authorization: 'Bearer ' + login.token } })
      const me = await meRes.json()
      console.log('ME', me)
    } else {
      console.log('No token received; skipping /me')
    }
  } catch (err) {
    console.error('TEST ERROR', err)
  }
}

run()
