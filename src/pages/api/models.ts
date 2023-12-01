import type { NextApiRequest, NextApiResponse } from 'next';
import { openai } from '@/lib/openai';

export default async function getCompletions(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const response = await openai.models.list();

  res.status(200).json(response.data);
}
