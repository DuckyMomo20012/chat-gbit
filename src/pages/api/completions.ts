import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { openai } from '@/lib/openai';
import type { DeepRequired } from '@/types/DeepRequired';

const bodySchema = z.object({
  model: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string(),
    }),
  ),
});

type TBody = DeepRequired<z.infer<typeof bodySchema>>;

export default async function getCompletions(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { body } = req;
  try {
    const { model, messages } = bodySchema.parse(body.data);

    const response = await openai.createChatCompletion({
      model,
      messages,
    } as TBody);

    res.status(200).json(response.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
