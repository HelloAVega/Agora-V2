async function run() {
  try {
    const base = 'http://localhost:3001'
    const res = await fetch(`${base}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Prueba', email: 'prueba@gmail.com', password: 'pass_prueba_123' }),
    })
    const body = await res.json()
    console.log('STATUS', res.status)
    console.log('BODY', body)
  } catch (err) {
    console.error('ERROR', err)
  }
}

run()
