import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { MODEL_LIST } from '@/constants/modelPrice';
import {
  type TModel,
  type TModelType,
  setModel,
} from '@/store/slice/modelSlice';
import { RootState } from '@/store/store';

const MINIMUM_FRACTION_DIGITS = 6;

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

const ModelPrice = ({
  label,
  model,
}: {
  label: string;
  model?: TModel<TModelType>;
}) => {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: MINIMUM_FRACTION_DIGITS,
  });

  return (
    <SimpleGrid cols={3}>
      <Text className="flex-1" fz="sm">
        {label}
      </Text>
      <Text fz="sm">
        <b>In</b>:{' '}
        {model?.price.in.value !== undefined
          ? currencyFormatter.format(model.price.in.value)
          : 'Unknown'}
        /{model?.price.in.per || 'Unknown'}
      </Text>
      <Text fz="sm">
        <b>Out</b>:{' '}
        {model?.price.out.value !== undefined
          ? currencyFormatter.format(model.price.out.value)
          : 'Unknown'}
        /{model?.price.out.per || 'Unknown'}
      </Text>
    </SimpleGrid>
  );
};

const ModelForm = () => {
  const models = useSelector((state: RootState) => state.model);
  const dispatch = useDispatch();

  const {
    control,
    watch,
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

  const watchChatModel = watch('chatModel');
  const watchAudioModel = watch('audioModel');

  const selectingChatModel = MODEL_LIST.find(
    (model) => model.name === watchChatModel,
  );
  const selectingAudioModel = MODEL_LIST.find(
    (model) => model.name === watchAudioModel,
  );

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
                data={MODEL_LIST.filter((model) => model.type === 'chat').map(
                  (model) => {
                    return {
                      label: model.name,
                      value: model.name,
                      group: model.provider.name,
                    };
                  },
                )}
                error={errors.chatModel?.message}
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
                data={MODEL_LIST.filter((model) => model.type === 'audio').map(
                  (model) => {
                    return {
                      label: model.name,
                      value: model.name,
                      group: model.provider.name,
                    };
                  },
                )}
                error={errors.audioModel?.message}
                {...field}
              />
            )}
          />
        </Group>

        <Card withBorder>
          <Stack spacing="sm">
            <Text fw={700}>Pricing</Text>

            <ModelPrice label="Chat" model={selectingChatModel} />

            <ModelPrice label="Audio" model={selectingAudioModel} />
          </Stack>
        </Card>

        <Group position="center">
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
