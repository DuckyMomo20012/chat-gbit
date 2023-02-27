import {
  Center,
  Group,
  Image,
  Loader,
  Avatar as MantineAvatar,
  Text,
} from '@mantine/core';
import Avatar from 'boring-avatars';
import clsx from 'clsx';

export type TChat = {
  id: string;
  type: 'prompt' | 'completion';
  text: React.ReactNode;
};

type TMessageProp = Omit<TChat, 'id'> & {
  userName?: string;
  colors?: Array<string>;
};

const Message = ({ userName, colors, type, text }: TMessageProp) => {
  return (
    <Center
      className={clsx('w-full p-4', {
        'bg-gray-100 dark:bg-gray-700': type === 'completion',
      })}
    >
      <Group className="w-full md:max-w-2xl lg:max-w-2xl xl:max-w-3xl" noWrap>
        <MantineAvatar
          className="self-start"
          color="indigo"
          radius="sm"
          size="md"
        >
          {type === 'completion' && (
            <Image className="p-1" src="/img/chatgpt.svg" />
          )}

          {type === 'prompt' &&
            (userName ? (
              <Avatar
                colors={colors}
                name={userName}
                size={28}
                variant="beam"
              />
            ) : (
              <Loader size="sm" />
            ))}
        </MantineAvatar>
        <Text>{text}</Text>
      </Group>
    </Center>
  );
};

export { Message };
