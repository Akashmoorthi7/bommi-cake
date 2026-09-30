// Vercel Serverless Function for /api/login
// Supports HTTP POST (credentials in request body) and GET (educational demo)

const DEFAULT_USERS = [
  {
    id: "usr-1",
    username: "Techwithakash",
    password: "123456789",
    name: "akash",
    email: "akash@bommicake.com",
    phone: "86*********",
    avatar: "🦸‍♀️",
    addresses: [
      {
        id: "addr-1",
        tag: "HOME HQ",
        receiver: "Techwithakash",
        phone: "86*********",
        addressLine: "Flat 402, Krypton Heights, Indiranagar",
        city: "Bengaluru",
        pincode: "560038",
        landmark: "Near Comic Con Central",
        isDefault: true
      }
    ]
  },
  {
    id: "usr-2",
    username: "alex_baker",
    password: "ComicCake@2026",
    name: "Alex Wonder",
    email: "alex@bommicake.com",
    phone: "9123456789",
    avatar: "🦸‍♂️",
    addresses: [
      {
        id: "addr-alex-1",
        tag: "STUDIO HQ",
        receiver: "Alex Wonder",
        phone: "9123456789",
        addressLine: "Studio 12, Marvel Art Lane, Bandra West",
        city: "Mumbai",
        pincode: "400050",
        landmark: "Opposite Comic Hub",
        isDefault: true
      }
    ]
  }
];

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let username = '';
  let password = '';

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        const params = new URLSearchParams(body);
        body = Object.fromEntries(params.entries());
      }
    }

    username = (body && body.username) || '';
    password = (body && body.password) || '';

    const foundUser = DEFAULT_USERS.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: `No registered account found for "${username}".`,
        methodUsed: 'POST',
        transmittedIn: 'body'
      });
    }

    if (foundUser.password !== password.trim()) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_PASSWORD',
        message: 'Incorrect password! Please check your credentials.',
        methodUsed: 'POST',
        transmittedIn: 'body'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful via HTTP POST!',
      user: foundUser,
      methodUsed: 'POST',
      transmittedIn: 'body'
    });
  } else if (req.method === 'GET') {
    username = (req.query && req.query.username) || '';
    password = (req.query && req.query.password) || '';

    const foundUser = DEFAULT_USERS.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!foundUser || foundUser.password !== password.trim()) {
      return res.status(401).json({
        success: false,
        error: 'AUTH_FAILED',
        message: 'Invalid credentials via GET.',
        methodUsed: 'GET',
        transmittedIn: 'url_query',
        warning: 'Credentials exposed in URL!'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login succeeded, BUT credentials were leaked in URL via GET!',
      user: foundUser,
      methodUsed: 'GET',
      transmittedIn: 'url_query',
      warning: 'Credentials exposed in URL!'
    });
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
