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

  const { votId, months, amountPerMonth, description } = req.body;
  if (!votId || !months || !amountPerMonth) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const inserts = [];
  for (let m = 1; m <= months; m++) {
    inserts.push({
      vot_id: votId,
      month: m,
      description: description || `Auto-payment month ${m}`,
      amount: amountPerMonth,
    });
  }

  const { data, error } = await supabase.from('expenses').insert(inserts);
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ expenses: data });
}
