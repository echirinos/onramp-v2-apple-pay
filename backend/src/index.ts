import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { generateJwt } from '@coinbase/cdp-sdk/auth';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Onramp Workshop Backend API',
    version: '1.0.0',
    endpoints: {
      'GET /': 'This endpoint - API information',
      'GET /health': 'Health check',
      'POST /api/create-order': 'Create onramp order'
    },
    status: 'running'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

app.post("/api/create-order", async (req, res) => {
  try {
    const requestHost = "api.developer.coinbase.com";
    const requestPath = "/onramp/v2/onramp/order";


    const token = await generateJwt({
      apiKeyId: process.env.CDP_API_KEY_ID!,
      apiKeySecret: process.env.CDP_API_KEY_SECRET!,
      requestMethod: "POST",
      requestHost: requestHost,
      requestPath: requestPath,
      expiresIn: 120 // optional (defaults to 120 seconds)
  });

    const response = await fetch(
      `https://${requestHost}${requestPath}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();

    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!", details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
