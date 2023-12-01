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
import { MODEL_PRICE } from '@/constants/modelPrice';
import { type TModel, setModel } from '@/store/slice/modelSlice';
import { RootState } from '@/store/store';

const MINIMUM_FRACTION_DIGITS = 6;

type TModelForm = {
  chatModel: TModel<'chat'>['name'];
};

const modelSchema = z.object({
  chatModel: z
    .string()
    .nullable()
    .refine(
      (val) =>
        MODEL_PRICE.find(
          (model) => model.type === 'chat' && model.name === val,
        ),
      {
        message: 'Invalid model',
      },
    ),
});

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
    },
  });

  const watchChatModel = watch('chatModel');

  const selectingChatModel = MODEL_PRICE.find(
    (model) => model.name === watchChatModel,
  );

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        chatModel: models.chat.name,
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
                data={MODEL_PRICE.filter((model) => model.type === 'chat').map(
                  (model) => {
                    return {
                      label: model.name,
                      value: model.name,
                      group: model.provider,
                    };
                  },
                )}
                error={errors.chatModel?.message}
                {...field}
              />
            )}
          />
        </Group>

        <Card withBorder>
          <Stack spacing="sm">
            <Text fw={700}>Pricing</Text>

            <SimpleGrid cols={3}>
              <Text className="flex-1" fz="sm">
                Chat
              </Text>
              <Text fz="sm">
                <b>In</b>:{' '}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: MINIMUM_FRACTION_DIGITS,
                }).format(selectingChatModel?.price.in.value || 0)}
                /{selectingChatModel?.price.in.per}
              </Text>
              <Text fz="sm">
                <b>Out</b>:{' '}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: MINIMUM_FRACTION_DIGITS,
                }).format(selectingChatModel?.price.out.value || 0)}
                /{selectingChatModel?.price.out.per}
              </Text>
            </SimpleGrid>
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
