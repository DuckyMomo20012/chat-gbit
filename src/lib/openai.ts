import { MODEL_LIST } from '@/constants/modelList';
import { OpenAI } from 'openai';
import { z } from 'zod';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatCompletionBodySchema = z.object({
  model: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string(),
    }),
  ),
});

export const transcriptionBodySchema = z.object({
  model: z.string(),
  file: z.unknown(),
});

export type TChatCompletionBody = z.infer<typeof chatCompletionBodySchema>;

export type TTranscriptionsBody = z.infer<typeof transcriptionBodySchema>;

export const getCompletions = async ({
  model,
  messages,
}: TChatCompletionBody) => {
  const foundModel = MODEL_LIST.find((m) => m.name === model);

  const response = await openai.chat.completions.create(
    {
      model,
      messages,
    } satisfies TChatCompletionBody,
    {
      ...(foundModel?.provider.baseUrl && {
        path: `${foundModel.provider?.baseUrl}/v1/chat/completions`,
      }),
    },
  );

  return response;
};

export const getTranscriptions = async ({
  model,
  file,
}: TTranscriptionsBody) => {
  const foundModel = MODEL_LIST.find((m) => m.name === model);

  const response = await openai.audio.transcriptions.create(
    {
      model,
      file: file as any,
    } satisfies TTranscriptionsBody,
    {
      ...(foundModel?.provider.baseUrl && {
        path: `${foundModel.provider?.baseUrl}/v1/chat/transcriptions`,
      }),
    },
  );

  return response;
};
