import { Icon } from '@iconify/react';
import { ActionIcon, Code, Menu, Popover, Text, Tooltip } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { PriceTable } from '@/components/elements/PriceTable';
import { UploadForm } from '@/components/modules/UploadForm';
import { MODEL_PRICE } from '@/constants/modelPrice';
import { setModel } from '@/store/slice/modelSlice';
import { RootState, persistor } from '@/store/store';

const MINIMUM_FRACTION_DIGITS = 6;

const ChatToolbar = () => {
  const chat = useSelector((state: RootState) => state.convo);
  const currModel = useSelector((state: RootState) => state.model);
  const allTimeToken = useSelector((state: RootState) => state.token);
  const dispatch = useDispatch();

  const currentToken = chat.reduce(
    (acc, item) => {
      if (item.usage) {
        return {
          prompt_tokens: acc.prompt_tokens + item.usage.prompt_tokens,
          completion_tokens:
            acc.completion_tokens + item.usage.completion_tokens,
          total_tokens: acc.total_tokens + item.usage.total_tokens,
        };
      }
      return acc;
    },
    {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    },
  );

  return (
    <>
      <Menu closeOnClickOutside={false} closeOnItemClick={false}>
        <Menu.Target>
          <Tooltip label="View usage">
            <ActionIcon
              aria-label="Usage"
              color="green"
              size="lg"
              variant="outline"
            >
              <Icon icon="material-symbols:data-usage" width={24} />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Model</Menu.Label>
          <Menu.Item>
            <PriceTable model={currModel} />
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Current Tokens</Menu.Label>
          <Menu.Item fz="sm">
            Prompt:{' '}
            <Code color="red" fw="bold">
              {currentToken.prompt_tokens}
            </Code>{' '}
          </Menu.Item>
          <Menu.Item fz="sm">
            Completion:{' '}
            <Code color="blue" fw="bold">
              {currentToken.completion_tokens}
            </Code>{' '}
          </Menu.Item>
          <Menu.Item fz="sm">
            Total:{' '}
            <Code color="green" fw="bold">
              {currentToken.total_tokens}
            </Code>{' '}
          </Menu.Item>

          <Menu.Item fw="bold" fz="sm">
            Next bill:{' '}
            <Text color="red" span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: MINIMUM_FRACTION_DIGITS,
                signDisplay: 'always',
              }).format(
                (currentToken.prompt_tokens * currModel.price.prompt +
                  currentToken.completion_tokens * currModel.price.completion) /
                  currModel.per,
              )}
            </Text>
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>All-time Tokens</Menu.Label>
          <Menu.Item fz="sm">
            Prompt:{' '}
            <Code color="red" fw="bold">
              {allTimeToken.prompt_tokens}
            </Code>{' '}
          </Menu.Item>
          <Menu.Item fz="sm">
            Completion:{' '}
            <Code color="blue" fw="bold">
              {allTimeToken.completion_tokens}
            </Code>{' '}
          </Menu.Item>
          <Menu.Item fz="sm">
            Total:{' '}
            <Code color="green" fw="bold">
              {allTimeToken.total_tokens}
            </Code>{' '}
          </Menu.Item>

          <Menu.Item fw="bold" fz="sm">
            Total billed:{' '}
            <Text color="red" span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: MINIMUM_FRACTION_DIGITS,
              }).format(
                (allTimeToken.prompt_tokens * currModel.price.prompt +
                  allTimeToken.completion_tokens * currModel.price.completion) /
                  currModel.per,
              )}
            </Text>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Menu>
        <Menu.Target>
          <Tooltip label="Set model">
            <ActionIcon
              aria-label="Model"
              color="violet"
              size="lg"
              variant="outline"
            >
              <Icon icon="material-symbols:mindfulness-outline" width={24} />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>

        <Menu.Dropdown>
          {MODEL_PRICE.map((model, idx) => (
            <Menu.Item key={idx} onClick={() => dispatch(setModel(model.name))}>
              <PriceTable model={model} />
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>

      <Popover closeOnClickOutside={false} width={400}>
        <Popover.Target>
          <Tooltip label="Upload conversation">
            <ActionIcon
              aria-label="Train"
              color="indigo"
              size="lg"
              variant="outline"
            >
              <Icon icon="material-symbols:upload" width={24} />
            </ActionIcon>
          </Tooltip>
        </Popover.Target>

        <Popover.Dropdown>
          <UploadForm />
        </Popover.Dropdown>
      </Popover>

      <Tooltip label="Clear conversation">
        <ActionIcon
          aria-label="Clear conversation"
          color="red"
          onClick={() => persistor.purge()}
          size="lg"
          variant="outline"
        >
          <Icon icon="material-symbols:delete-outline" width={24} />
        </ActionIcon>
      </Tooltip>
    </>
  );
};

export { ChatToolbar };
