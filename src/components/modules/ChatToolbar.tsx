import { Icon } from '@iconify/react';
import {
  ActionIcon,
  Button,
  Code,
  Menu,
  Popover,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { UploadForm } from '@/components/modules/UploadForm';
import { MODEL, setModel } from '@/store/slice/modelSlice';
import { RootState, persistor } from '@/store/store';

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
          <Button variant="outline">Usage</Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Model</Menu.Label>
          <Menu.Item fz="sm">
            Name: <Code color="green">{currModel.name}</Code>
          </Menu.Item>
          <Menu.Item fz="sm">
            Price:{' '}
            <Text color="indigo" span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 4,
              }).format(currModel.price)}
            </Text>{' '}
            /{' '}
            {new Intl.NumberFormat('en-US', {
              notation: 'compact',
              compactDisplay: 'short',
            }).format(currModel.per)}{' '}
            tokens
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
                minimumFractionDigits: 4,
                signDisplay: 'always',
              }).format(
                (currentToken.total_tokens * currModel.price) / currModel.per,
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
                minimumFractionDigits: 4,
              }).format(
                (allTimeToken.total_tokens * currModel.price) / currModel.per,
              )}
            </Text>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Menu>
        <Menu.Target>
          <Button variant="outline">Model</Button>
        </Menu.Target>

        <Menu.Dropdown>
          {MODEL.map((model, idx) => (
            <Menu.Item
              key={idx}
              onClick={() => dispatch(setModel(model.name))}
              rightSection={
                <Text>
                  <Code className="ml-2" color="orange">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 4,
                    }).format(model.price)}
                  </Code>{' '}
                  /{' '}
                  {new Intl.NumberFormat('en-US', {
                    notation: 'compact',
                    compactDisplay: 'short',
                  }).format(currModel.per)}{' '}
                  tokens
                </Text>
              }
            >
              {model.name}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>

      <Popover closeOnClickOutside={false} width={400}>
        <Popover.Target>
          <Button variant="outline">Train</Button>
        </Popover.Target>

        <Popover.Dropdown>
          <UploadForm />
        </Popover.Dropdown>
      </Popover>

      <Tooltip label="Clear conversation">
        <ActionIcon
          aria-label="Clear conversation"
          color="red"
          data-test-id="remove-convo"
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
