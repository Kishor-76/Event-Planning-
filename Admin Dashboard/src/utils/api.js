// Admin Dashboard API Utilities
export const API_BASE = 'http://localhost:5000'

export async function fetchJSON(url, opts = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...opts.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...opts,
    headers,
  })

  if (!response.ok) {
    const text = await response.text()
    let errorMsg = response.statusText
    try {
      const errJson = JSON.parse(text)
      errorMsg = errJson.message || errorMsg
    } catch {
      errorMsg = text || errorMsg
    }
    throw new Error(errorMsg)
  }

  return response.json()
}
