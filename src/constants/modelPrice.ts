import type { TModel, TModelType } from '@/store/slice/modelSlice';

export const MODEL_LIST = [
  {
    type: 'chat',
    name: 'gpt-3.5-turbo',
    price: {
      in: { value: 0.0002, per: '1K tokens' },
      out: { value: 0.0002, per: '1K tokens' },
    },
    provider: { name: 'OpenAI' },
  },
  {
    type: 'chat',
    name: 'gpt-3.5-turbo-0301',
    price: {
      in: { value: 0.0002, per: '1K tokens' },
      out: { value: 0.0002, per: '1K tokens' },
    },
    provider: { name: 'OpenAI' },
  },
  {
    type: 'chat',
    name: 'ggml-gpt4all-j-v1.3-groovy.bin',
    price: {
      in: { value: 0, per: 'tokens' },
      out: { value: 0, per: 'tokens' },
    },
    provider: { name: 'Self-hosted', url: process.env.LOCAL_AI_BASE_URL },
  },
  {
    type: 'audio',
    name: 'ggml-whisper-base.bin',
    price: {
      in: { value: 0, per: 'minute' },
      out: { value: 0, per: 'minute' },
    },
    provider: { name: 'Self-hosted', url: process.env.LOCAL_AI_BASE_URL },
  },
] as const satisfies readonly TModel<TModelType>[];
