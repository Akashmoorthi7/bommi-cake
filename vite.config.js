import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, 'server_users.json');

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading server_users.json:', err);
  }
  return [
    {
      id: 'usr-1',
      username: 'Techwithakash',
      password: '123456789',
      name: 'akash',
      email: 'akash@bommicake.com',
      phone: '86*********',
      avatar: '🦸‍♀️',
    },
    {
      id: 'usr-2',
      username: 'alex_baker',
      password: 'ComicCake@2026',
      name: 'Alex Wonder',
      email: 'alex@bommicake.com',
      phone: '9123456789',
      avatar: '🦸‍♂️',
    }
  ];
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving server_users.json:', err);
  }
}

// Vite plugin to provide HTTP POST / GET authentication API for Wireshark inspection
function webSecurityAuthPlugin() {
  return {
    name: 'web-security-auth-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost:5173'}`);

        // Route: /api/login
        if (url.pathname === '/api/login') {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk.toString();
            });

            req.on('end', () => {
              const contentType = req.headers['content-type'] || '';
              let username = '';
              let password = '';

              if (contentType.includes('application/json')) {
                try {
                  const data = JSON.parse(body || '{}');
                  username = data.username || '';
                  password = data.password || '';
                } catch (e) {
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  return res.end(JSON.stringify({ success: false, message: 'Invalid JSON payload' }));
                }
              } else if (contentType.includes('application/x-www-form-urlencoded')) {
                const params = new URLSearchParams(body);
                username = params.get('username') || '';
                password = params.get('password') || '';
              } else {
                try {
                  const data = JSON.parse(body || '{}');
                  username = data.username || '';
                  password = data.password || '';
                } catch {
                  const params = new URLSearchParams(body);
                  username = params.get('username') || '';
                  password = params.get('password') || '';
                }
              }

              console.log('\n' + '='.repeat(65));
              console.log('🛡️  [HTTP POST /api/login] RECEIVED IN REQUEST BODY');
              console.log('='.repeat(65));
              console.log(`📡 Method:       POST`);
              console.log(`🌐 Request URL:  ${req.url} (Clean URL: NO credentials leaked in URL!)`);
              console.log(`📦 Content-Type: ${contentType}`);
              console.log(`📄 Payload Body: ${body}`);
              console.log(`👤 Username:     ${username}`);
              console.log(`🔑 Password:     ${password} (Transmitted inside HTTP Body)`);
              console.log('='.repeat(65) + '\n');

              const users = loadUsers();
              const foundUser = users.find(
                (u) => u.username.toLowerCase() === username.trim().toLowerCase()
              );

              if (!foundUser) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(
                  JSON.stringify({
                    success: false,
                    error: 'USER_NOT_FOUND',
                    message: `No registered account found for "${username}". Would you like to create a new account?`,
                    methodUsed: 'POST',
                    transmittedIn: 'body',
                  })
                );
              }

              if (foundUser.password !== password.trim()) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                return res.end(
                  JSON.stringify({
                    success: false,
                    error: 'INVALID_PASSWORD',
                    message: 'Incorrect password! Please check your credentials and try again.',
                    methodUsed: 'POST',
                    transmittedIn: 'body',
                  })
                );
              }

              res.writeHead(200, { 'Content-Type': 'application/json' });
              return res.end(
                JSON.stringify({
                  success: true,
                  message: 'Login successful via HTTP POST!',
                  user: foundUser,
                  methodUsed: 'POST',
                  transmittedIn: 'body',
                })
              );
            });
            return;
          } else if (req.method === 'GET') {
            // For educational comparison: show how GET leaks data in URL
            const username = url.searchParams.get('username') || '';
            const password = url.searchParams.get('password') || '';

            console.log('\n' + '!'.repeat(65));
            console.log('⚠️  [HTTP GET /api/login] INSECURE: CREDENTIALS EXPOSED IN URL!');
            console.log('!'.repeat(65));
            console.log(`📡 Method:       GET`);
            console.log(`🌐 Full URL:     ${req.url}`);
            console.log(`⚠️  Query String: ${url.search}`);
            console.log(`👤 Username:     ${username}`);
            console.log(`🔑 Password:     ${password} <-- EXPOSED IN URL / ACCESS LOGS / HISTORY`);
            console.log('!'.repeat(65) + '\n');

            const users = loadUsers();
            const foundUser = users.find(
              (u) => u.username.toLowerCase() === username.trim().toLowerCase()
            );

            if (!foundUser) {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              return res.end(
                JSON.stringify({
                  success: false,
                  error: 'USER_NOT_FOUND',
                  message: `No registered account found for "${username}".`,
                  methodUsed: 'GET',
                  transmittedIn: 'url_query',
                  warning: 'Credentials were sent in the URL query string!',
                })
              );
            }

            if (foundUser.password !== password.trim()) {
              res.writeHead(401, { 'Content-Type': 'application/json' });
              return res.end(
                JSON.stringify({
                  success: false,
                  error: 'INVALID_PASSWORD',
                  message: 'Incorrect password!',
                  methodUsed: 'GET',
                  transmittedIn: 'url_query',
                  warning: 'Credentials were sent in the URL query string!',
                })
              );
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(
              JSON.stringify({
                success: true,
                message: 'Login succeeded, BUT credentials were leaked in URL via GET!',
                user: foundUser,
                methodUsed: 'GET',
                transmittedIn: 'url_query',
                warning: 'Credentials were sent in the URL query string!',
              })
            );
          }
        }

        // Route: /api/register
        if (url.pathname === '/api/register' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk.toString();
          });

          req.on('end', () => {
            let regData = {};
            try {
              regData = JSON.parse(body || '{}');
            } catch (e) {
              const params = new URLSearchParams(body);
              regData = Object.fromEntries(params.entries());
            }

            const { username, password, name, phone, email, avatar } = regData;
            console.log(`🛡️  [HTTP POST /api/register] New user registration received in body for: ${username}`);

            const users = loadUsers();
            const isTaken = users.some(
              (u) => u.username.toLowerCase() === (username || '').trim().toLowerCase()
            );

            if (isTaken) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              return res.end(
                JSON.stringify({
                  success: false,
                  error: 'USERNAME_TAKEN',
                  message: `The username "${username}" is already taken.`,
                })
              );
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

            users.push(newUser);
            saveUsers(users);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            return res.end(
              JSON.stringify({
                success: true,
                message: 'Account registered successfully via POST!',
                user: newUser,
              })
            );
          });
          return;
        }

        // Route: /api/users
        if (url.pathname === '/api/users' && req.method === 'GET') {
          const users = loadUsers().map(({ password, ...safe }) => safe);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(users));
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), webSecurityAuthPlugin()],
  server: {
    port: 5173,
    host: true,
  },
});
