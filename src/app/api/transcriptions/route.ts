import { z } from 'zod';
import { getTranscriptions } from '@/lib/openai';

export const transcriptionBodySchema = z.object({
  model: z.string(),
  audio: z.unknown(),
});

const POST = async (req: Request) => {
  const formData = await req.formData();

  const model = formData.get('model');
  const audio = formData.get('audio');

  try {
    transcriptionBodySchema.parse({
      model,
      audio,
    });

    const response = await getTranscriptions({
      model: model as string,
      file: audio,
    });

    return Response.json(response, {
      status: 200,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json(
        { error: 'Bad request' },
        {
          status: 400,
        },
      );
    }

    return Response.json(
      { error: 'Internal server error' },
      {
        status: 500,
      },
    );
  }
};

export { POST };
