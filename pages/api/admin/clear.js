import { supabase } from '../../../lib/supabase';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Delete all records from all tables to start fresh
  const tables = ['expenses', 'vots', 'tabung_amanah', 'akaun_amanah', 'users'];
  try {
    for (const tbl of tables) {
      await supabase.from(tbl).delete().neq('id', '00000000-0000-0000-0000-000000000000'); // delete all rows
    }
    res.status(200).json({ message: 'All data cleared.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to clear data.' });
  }
}
