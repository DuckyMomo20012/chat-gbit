import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group, Select, Stack, Text } from '@mantine/core';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { MODEL_LIST } from '@/constants/modelList';
import {
  type TModel,
  type TModelType,
  setModel,
} from '@/store/slice/modelSlice';
import { RootState } from '@/store/store';

type TModelForm = {
  chatModel: TModel<'chat'>['name'];
  audioModel: TModel<'audio'>['name'];
};

const modelSchema = z.object({
  chatModel: z
    .string()
    .nullable()
    .refine(
      (val) =>
        MODEL_LIST.find((model) => model.type === 'chat' && model.name === val),
      {
        message: 'Invalid model',
      },
    ),
  audioModel: z
    .string()
    .nullable()
    .refine(
      (val) =>
        MODEL_LIST.find(
          (model) => model.type === 'audio' && model.name === val,
        ),
      {
        message: 'Invalid model',
      },
    ),
});

const mapModelToSelect = (
  type: TModelType,
  model: readonly TModel<TModelType>[],
) => {
  const groupByProvider = model
    .filter((m) => m.type === type)
    .reduce(
      (acc, m) => {
        const provider = m.provider.name;

        acc[provider] = acc[provider] || [];
        acc[provider] = [...acc[provider], { label: m.name, value: m.name }];
        return acc;
      },
      {} as Record<string, { label: string; value: string }[]>,
    );

  return Object.entries(groupByProvider).map(([provider, models]) => {
    return {
      group: provider,
      items: models,
    };
  });
};

const ModelForm = () => {
  const models = useSelector((state: RootState) => state.model);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isDirty },
  } = useForm<TModelForm>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      chatModel: models.chat.name,
      audioModel: models.audio.name,
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        chatModel: models.chat.name,
        audioModel: models.audio.name,
      });
    }
  }, [isSubmitSuccessful, models, reset]);

  const onSubmit = (data: TModelForm) => {
    dispatch(
      setModel([
        {
          type: 'chat',
          name: data.chatModel,
        },
        {
          type: 'audio',
          name: data.audioModel,
        },
      ]),
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Group>
          <Text className="flex-1">Chat model</Text>
          <Controller
            control={control}
            name="chatModel"
            render={({ field }) => (
              <Select
                data={mapModelToSelect('chat', MODEL_LIST)}
                error={errors.audioModel?.message}
                {...field}
              />
            )}
          />
        </Group>

        <Group>
          <Text className="flex-1">Audio model</Text>
          <Controller
            control={control}
            name="audioModel"
            render={({ field }) => (
              <Select
                data={mapModelToSelect('audio', MODEL_LIST)}
                error={errors.audioModel?.message}
                {...field}
              />
            )}
          />
        </Group>

        <Group justify="center">
          <Button disabled={!isDirty} onClick={() => reset()} variant="outline">
            Discard
          </Button>
          <Button disabled={!isDirty} type="submit">
            Update
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export { ModelForm };
