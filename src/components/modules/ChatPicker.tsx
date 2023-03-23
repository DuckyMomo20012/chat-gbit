import { Icon } from '@iconify/react';
import { Button, Group, Menu } from '@mantine/core';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { ChatContext } from '@/context';
import { selectHistories } from '@/store/slice/historySlice';
import { RootState } from '@/store/store';

const ChatPicker = () => {
  const histories = useSelector((state: RootState) => selectHistories(state));
  const router = useRouter();

  const { setChatId } = useContext(ChatContext);

  return (
    <Group>
      <Button
        leftIcon={<Icon height={24} icon="material-symbols:add" width={24} />}
        onClick={() => {
          setChatId('');
          router.push('/chat');
        }}
      >
        New
      </Button>
      <Menu>
        <Menu.Target>
          <Button>Select chat</Button>
        </Menu.Target>

        <Menu.Dropdown>
          {histories.map((history) => {
            return (
              <Menu.Item
                key={history.id}
                onClick={() => router.push(`/chat/${history.id}`)}
              >
                {history.title}
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};

export { ChatPicker };
