import http from 'http'

http.get('http://localhost:5174', (res) => {
  console.log('STATUS:', res.statusCode)
  console.log('HEADERS:', JSON.stringify(res.headers))
  let body = ''
  res.on('data', (chunk) => body += chunk)
  res.on('end', () => {
    console.log('BODY LENGTH:', body.length)
    console.log('BODY PREVIEW:', body.substring(0, 500))
  })
}).on('error', (e) => {
  console.error('ERROR:', e.message)
})
