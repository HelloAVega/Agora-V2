const fetch = require('node-fetch')

async function run() {
  const base = 'http://localhost:3001'
  try {
    const regRes = await fetch(base + '/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'TestUpdate', email: 'update@test.com', password: 'pass123' }),
    })
    const reg = await regRes.json()
    console.log('REG', reg)

    const loginRes = await fetch(base + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'update@test.com', password: 'pass123' }),
    })
    const login = await loginRes.json()
    console.log('LOGIN', login)

    if (login.token) {
      const updRes = await fetch(base + '/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + login.token },
        body: JSON.stringify({ name: 'Updated Name' }),
      })
      const upd = await updRes.json()
      console.log('UPDATE', upd)

      const chRes = await fetch(base + '/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + login.token },
        body: JSON.stringify({ currentPassword: 'pass123', newPassword: 'newpass123' }),
      })
      const ch = await chRes.json()
      console.log('CHPASS', ch)
    }
  } catch (err) {
    console.error('ERR', err)
  }
}

run()
