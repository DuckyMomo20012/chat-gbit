import { Icon } from '@iconify/react';
import { ActionIcon, Button, Code, Menu, Text, Tooltip } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { MODEL, setModel } from '@/store/slice/modelSlice';
import { RootState, persistor } from '@/store/store';

const ChatToolbar = () => {
  const chat = useSelector((state: RootState) => state.convo);
  const currModel = useSelector((state: RootState) => state.model);
  const dispatch = useDispatch();

  const totalPromptToken = chat.reduce((acc, item) => {
    if (item.usage?.prompt_tokens) {
      return acc + item.usage.prompt_tokens;
    }
    return acc;
  }, 0);

  const totalCompletionToken = chat.reduce((acc, item) => {
    if (item.usage?.completion_tokens) {
      return acc + item.usage.completion_tokens;
    }
    return acc;
  }, 0);

  return (
    <>
      <Menu closeOnClickOutside={false} closeOnItemClick={false}>
        <Menu.Target>
          <Button variant="outline">Usage</Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Tokens</Menu.Label>
          <Menu.Item fz="sm">
            Prompt:{' '}
            <Code color="red" fw="bold">
              {totalPromptToken}
            </Code>{' '}
          </Menu.Item>
          <Menu.Item fz="sm">
            Completion:{' '}
            <Code color="blue" fw="bold">
              {totalCompletionToken}
            </Code>{' '}
          </Menu.Item>
          <Menu.Item fz="sm">
            Total:{' '}
            <Code color="green" fw="bold">
              {totalPromptToken + totalCompletionToken}
            </Code>{' '}
          </Menu.Item>

          <Menu.Divider />

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
            </Text>
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Cost</Menu.Label>
          <Menu.Item fz="sm">
            Bill:{' '}
            <Text color="red" span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 4,
              }).format(
                (totalPromptToken + totalCompletionToken) * currModel.price,
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
                <Code className="ml-2" color="orange">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 4,
                  }).format(model.price)}
                </Code>
              }
            >
              {model.name}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>

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
