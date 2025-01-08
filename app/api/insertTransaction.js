import { pool } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { type, description, deposit, withdraw } = req.body;
    const query = 'INSERT INTO transactions (type, description, deposit, withdraw) VALUES ($1, $2, $3, $4)';
    await pool.query(query, [type, description, deposit || 0, withdraw || 0]);
    res.status(200).json({ message: 'লেনদেন সফলভাবে যোগ হয়েছে' });
  } else {
    res.status(405).json({ message: 'এই পদ্ধতি অনুমোদিত নয়' });
  }
}
