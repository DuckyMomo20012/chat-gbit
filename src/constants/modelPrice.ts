import type { TModel } from '@/store/slice/modelSlice';

export const MODEL_PRICE = [
  {
    name: 'gpt-3.5-turbo',
    price: {
      prompt: 0.0002,
      completion: 0.0002,
    },
    per: 1000,
  },
  {
    name: 'gpt-3.5-turbo-0301',
    price: {
      prompt: 0.0002,
      completion: 0.0002,
    },
    per: 1000,
  },
] satisfies Array<TModel>;
