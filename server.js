const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 8080;

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 120, // limit each IP to 120 requests per windowMs
  message: { success: false, message: "Too many requests, please try again later." }
});

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(limiter);

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', apiRoutes);

// Alias routes for compatibility (server instead of api)
app.use('/server', apiRoutes);

// Docs endpoint - simple HTML page with ReDoc
app.get('/docs', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>QWER API Documentation</title>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
  <style>
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  <redoc spec-url='/openapi.yaml'></redoc>
  <script src="https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js"></script>
</body>
</html>
  `);
});

// OpenAPI spec endpoint
app.get('/openapi.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, 'openapi.yaml'));
});

// Alias for openapi spec
app.get('/openserver.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, 'openapi.yaml'));
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    data: null
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🎸 QWER Band API Server starting on port ' + PORT + '...');
  console.log('📋 Available endpoints:');
  console.log('  • GET http://localhost:' + PORT + '/        - Website');
  console.log('  • GET http://localhost:' + PORT + '/api     - API Index');
  console.log('  • GET http://localhost:' + PORT + '/docs    - API Docs (ReDoc)');
  console.log('\n🚀 Server ready! Press Ctrl+C to stop.\n');
});

module.exports = app;

