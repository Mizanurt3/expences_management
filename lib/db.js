// lib/db.js
import { Pool } from 'pg';

const connectionString = process.env.POSTGRES_URL;

export const pool = new Pool({
  connectionString,
});
