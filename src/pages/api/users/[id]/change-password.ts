import crypto from 'crypto';
import { bcrypt } from 'hash-wasm';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { HASH_ROUNDS, userBodySchema } from '@/pages/api/users/index';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Bad request' });
  }

  switch (req.method) {
    case 'PATCH': {
      try {
        const parsedBody = userBodySchema
          .pick({
            password: true,
          })
          .parse(req.body);

        const newHashedPassword = await bcrypt({
          password: parsedBody.password,
          salt: crypto.randomBytes(16),
          costFactor: HASH_ROUNDS,
        });

        const result = await prisma.user.update({
          where: { id: id as string },
          data: {
            password: newHashedPassword,
          },
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return res.status(200).json(result);
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({ error: 'Bad request' });
        }

        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    default: {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  }
}

export default handler;
