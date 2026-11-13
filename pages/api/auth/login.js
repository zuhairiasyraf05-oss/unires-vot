import { supabase } from '../../../lib/supabase';
import { comparePassword, generateToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, password } = req.body;
  const { data: user, error } = await supabase
    .from('users')
    .select('id, password_hash, role')
    .eq('email', email)
    .single();
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = generateToken({ id: user.id, role: user.role });
  res.status(200).json({ token });
}
