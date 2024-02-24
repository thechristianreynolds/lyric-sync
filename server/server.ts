import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors';
import lyrics from './routes/lyrics';
import plex from './routes/plex';
//
import connectDB from './config/db';

// initialize Hono app
const app = new Hono().basePath('/api/v1');

// config mongodb
connectDB();

// Cors
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// lyrics route
app.route('/lyrics', lyrics)
app.route('/plex', plex);


const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
