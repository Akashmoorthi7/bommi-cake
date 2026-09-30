// Vercel Serverless Function for /api/register
// Handles HTTP POST registration requests

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      const params = new URLSearchParams(body);
      body = Object.fromEntries(params.entries());
    }
  }

  const { username, password, name, phone, email, avatar } = body || {};

  if (!username || username.trim().length < 3) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_USERNAME',
      message: 'Username must be at least 3 characters.',
    });
  }

  if (!password || password.trim().length < 6) {
    return res.status(400).json({
      success: false,
      error: 'PASSWORD_TOO_SHORT',
      message: 'Password must be at least 6 characters.',
    });
  }

  const newUser = {
    id: 'usr-' + Date.now(),
    username: username.trim(),
    password: password.trim(),
    name: name?.trim() || username.trim(),
    email: email?.trim() || `${username.trim().toLowerCase()}@bommicake.com`,
    phone: phone?.trim() || '9876543210',
    avatar: avatar || '🦸‍♂️',
    addresses: [],
  };

  return res.status(201).json({
    success: true,
    message: 'Account registered successfully via POST!',
    user: newUser,
  });
}
