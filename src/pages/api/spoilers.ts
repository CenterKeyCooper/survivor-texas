import type { NextApiRequest, NextApiResponse } from 'next';
import { timingSafeEqual } from 'crypto';
import spoilers from '../../../data/private/spoilers.json';

const PASSWORD = process.env.SPOILER_PASSWORD || 'joyce';

function matches(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!matches(password.trim().toLowerCase(), PASSWORD.toLowerCase())) {
    return res.status(401).json({ error: 'Incorrect password' });
  }
  return res.status(200).json(spoilers);
}
