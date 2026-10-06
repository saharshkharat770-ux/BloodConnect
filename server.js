/**
 * BloodConnect — Backend Mock REST API & Static Server
 * Zero external dependencies (Native Node.js HTTP & FS)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

// Helper: Read database from disk
function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[Database Error] Failed to read db.json:', err.message);
    return { stats: {}, inventory: [], donors: [], requests: [], hospitals: [], activity: [] };
  }
}

// Helper: Save database to disk
function saveDB(db) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[Database Error] Failed to write db.json:', err.message);
    return false;
  }
}

// Helper: Parse request JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  console.log(`[API Request] ${method} ${pathname}`);

  // ==========================================
  // REST API ROUTING
  // ==========================================

  // 1. GET /api/stats
  if (method === 'GET' && pathname === '/api/stats') {
    const db = readDB();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.stats));
    return;
  }

  // 2. GET /api/inventory
  if (method === 'GET' && pathname === '/api/inventory') {
    const db = readDB();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.inventory));
    return;
  }

  // 3. GET & POST /api/donors
  if (pathname === '/api/donors') {
    const db = readDB();

    if (method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.donors));
      return;
    }

    if (method === 'POST') {
      try {
        const body = await parseBody(req);
        const newDonor = {
          id: `BC-${Math.floor(10000 + Math.random() * 90000)}`,
          name: body.name || 'Anonymous Donor',
          bloodGroup: body.bloodGroup || 'O+',
          age: parseInt(body.age, 10) || 28,
          location: body.location || body.city || 'Pune, MH',
          phone: body.phone || 'N/A',
          email: body.email || 'N/A',
          lastDonation: 'Just Registered',
          eligibility: 'Eligible',
          status: 'Active',
          registeredAt: new Date().toISOString()
        };

        db.donors.unshift(newDonor);
        db.stats.activeDonors += 1;

        // Log to activity timeline
        db.activity.unshift({
          id: `ACT-${Date.now()}`,
          type: 'success',
          title: 'Donor Registration Completed',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: `Voluntary donor registered: ${newDonor.id} (${newDonor.name}, ${newDonor.bloodGroup}).`
        });

        saveDB(db);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, donor: newDonor }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON request payload' }));
      }
      return;
    }
  }

  // 4. GET & POST /api/requests
  if (pathname === '/api/requests') {
    const db = readDB();

    if (method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.requests));
      return;
    }

    if (method === 'POST') {
      try {
        const body = await parseBody(req);
        const newRequest = {
          id: `REQ-${Math.floor(2000 + Math.random() * 8000)}`,
          hospital: body.hospital || 'Regional Hospital',
          department: body.department || 'Trauma Center',
          patientId: body.patientId || `PAT-${Math.floor(10000 + Math.random() * 90000)}`,
          bloodGroup: body.bloodGroup || 'O-',
          units: parseInt(body.units, 10) || 2,
          priority: body.priority || 'Urgent',
          requestedTime: 'Just Now',
          neededBy: body.neededBy || '02:00 Hours',
          status: 'Matching',
          createdAt: new Date().toISOString()
        };

        db.requests.unshift(newRequest);
        if (newRequest.priority === 'Critical') {
          db.stats.emergencyRequests += 1;
        } else {
          db.stats.pendingRequests += 1;
        }

        // Log to activity timeline
        db.activity.unshift({
          id: `ACT-${Date.now()}`,
          type: newRequest.priority === 'Critical' ? 'critical' : 'warning',
          title: 'Blood Requisition Created',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: `${newRequest.priority} ${newRequest.bloodGroup} request (${newRequest.units} units) for ${newRequest.hospital}.`
        });

        saveDB(db);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, request: newRequest }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON request payload' }));
      }
      return;
    }
  }

  // 5. GET /api/hospitals
  if (method === 'GET' && pathname === '/api/hospitals') {
    const db = readDB();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.hospitals));
    return;
  }

  // 6. GET /api/activity
  if (method === 'GET' && pathname === '/api/activity') {
    const db = readDB();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.activity));
    return;
  }

  // ==========================================
  // STATIC FILE SERVING (HTML, CSS, ASSETS)
  // ==========================================
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath);

  // If path has no extension and is not /api, try adding .html
  if (!ext && !pathname.startsWith('/api')) {
    filePath += '.html';
  }

  const fileExt = path.extname(filePath);
  const contentType = MIME_TYPES[fileExt] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 Not Found - BloodConnect</h1><p><a href="/">Return to Home</a></p>');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Internal Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  BloodConnect Healthcare Backend API & Web Server`);
  console.log(`======================================================`);
  console.log(`  Local URL:   http://localhost:${PORT}`);
  console.log(`  Database:    ${DB_PATH}`);
  console.log(`  API Status:  Ready (Zero-Dependency Node.js HTTP/REST)`);
  console.log(`======================================================\n`);
});
