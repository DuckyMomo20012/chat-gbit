import { Icon } from '@iconify/react';
import { ActionIcon, Group, Stack, Text, Tooltip } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { decrement, increment, reset } from '@/store/slice/counterSlice';
import type { RootState } from '@/store/store';

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <Stack align="center">
      <Text fz="2rem">{count}</Text>
      <Group>
        <Tooltip color="blue" label="Increase" position="bottom">
          <ActionIcon
            aria-label="Increase counter by 1"
            color="blue"
            onClick={() => dispatch(increment())}
            size="lg"
            variant="light"
          >
            <Icon height={18} icon="ic:outline-plus" width={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip color="cyan" label="Decrease" position="bottom">
          <ActionIcon
            aria-label="Decrease counter by 1"
            color="cyan"
            onClick={() => dispatch(decrement())}
            size="lg"
            variant="light"
          >
            <Icon height={18} icon="ic:outline-minus" width={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip color="orange" label="Reset" position="bottom">
          <ActionIcon
            aria-label='Reset counter to "0"'
            color="orange"
            onClick={() => dispatch(reset())}
            size="lg"
            variant="light"
          >
            <Icon height={18} icon="ic:outline-refresh" width={18} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Stack>
  );
};

export { Counter };
