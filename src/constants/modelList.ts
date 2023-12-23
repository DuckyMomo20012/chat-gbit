import type { TModel, TModelType } from '@/store/slice/modelSlice';

export const MODEL_LIST = [
  {
    type: 'chat',
    name: 'gpt-3.5-turbo',
    provider: { name: 'OpenAI', baseUrl: '' },
  },
  {
    type: 'chat',
    name: 'gpt-3.5-turbo-0301',
    provider: { name: 'OpenAI', baseUrl: '' },
  },
  {
    type: 'chat',
    name: 'ggml-gpt4all-j-v1.3-groovy.bin',
    provider: { name: 'Self-hosted', baseUrl: process.env.LOCAL_AI_BASE_URL },
  },
  {
    type: 'audio',
    name: 'whisper-1',
    provider: { name: 'OpenAI', baseUrl: '' },
  },
  {
    type: 'audio',
    name: 'ggml-whisper-base.bin',
    provider: { name: 'Self-hosted', baseUrl: process.env.LOCAL_AI_BASE_URL },
  },
] as const satisfies readonly TModel<TModelType>[];
