import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Group, Select, Stack, Text } from '@mantine/core';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { MODEL_PRICE } from '@/constants/modelPrice';
import { setModel } from '@/store/slice/modelSlice';
import { RootState } from '@/store/store';

const MINIMUM_FRACTION_DIGITS = 6;

type TModelForm = {
  chatModel: string;
};

const modelSchema = z.object({
  chatModel: z
    .string()
    .nullable()
    .refine((val) => MODEL_PRICE.find((model) => model.name === val)),
});

const ModelForm = () => {
  const currModel = useSelector((state: RootState) => state.model);
  const dispatch = useDispatch();

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, isDirty },
  } = useForm<TModelForm>({
    resolver: zodResolver(modelSchema),
    mode: 'onChange',
    defaultValues: {
      chatModel: currModel.name,
    },
  });

  const watchChatModel = watch('chatModel');

  const selectingModel = MODEL_PRICE.find(
    (model) => model.name === watchChatModel,
  );

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        chatModel: currModel.name,
      });
    }
  }, [isSubmitSuccessful, currModel, reset]);

  const onSubmit = (data: TModelForm) => {
    dispatch(
      setModel(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        MODEL_PRICE.find((model) => model.name === data.chatModel)!.name,
      ),
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Group>
          <Text className="flex-1">Model</Text>
          <Controller
            control={control}
            name="chatModel"
            render={({ field }) => (
              <Select
                data={MODEL_PRICE.map((model) => model.name)}
                {...field}
              />
            )}
          />
        </Group>

        <Card withBorder>
          <Stack spacing="sm">
            <Text fw={700}>Pricing</Text>

            <Group>
              <Text className="flex-1" fz="sm">
                Prompt
              </Text>
              <Text fz="sm">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: MINIMUM_FRACTION_DIGITS,
                }).format(selectingModel?.price.prompt || 0)}
                /
                {new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(selectingModel?.per || 0)}{' '}
                tokens
              </Text>
            </Group>

            <Group>
              <Text className="flex-1" fz="sm">
                Completion
              </Text>
              <Text fz="sm">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: MINIMUM_FRACTION_DIGITS,
                }).format(selectingModel?.price.completion || 0)}
                /
                {new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(selectingModel?.per || 0)}{' '}
                tokens
              </Text>
            </Group>
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
