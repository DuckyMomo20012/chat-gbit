import crypto from 'crypto';
import { bcrypt, bcryptVerify } from 'hash-wasm';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { z } from 'zod';
import { updateUser } from '@/pages/api/users/[userId]/index';
import { HASH_ROUNDS } from '@/pages/api/users/index';

export const changePasswordBodySchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Bad request' });
  }

  switch (req.method) {
    case 'PATCH': {
      try {
        const parsedBody = changePasswordBodySchema.parse(req.body);

        const user = await prisma?.user.findUniqueOrThrow({
          where: { id: userId as string },
          select: { password: true },
        });

        if (!user) {
          return res.status(404).json({ error: 'Not found' });
        }

        const oldPasswordMatches = await bcryptVerify({
          password: parsedBody.oldPassword,
          hash: user.password,
        });

        if (!oldPasswordMatches) {
          return res.status(400).json({ error: 'Bad request' });
        }

        const newHashedPassword = await bcrypt({
          password: parsedBody.newPassword,
          salt: crypto.randomBytes(16),
          costFactor: HASH_ROUNDS,
        });

        const result = await updateUser(userId as string, {
          password: newHashedPassword,
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
