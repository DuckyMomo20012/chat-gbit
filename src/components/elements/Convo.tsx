import {
  Center,
  Group,
  Avatar as MantineAvatar,
  Stack,
  Text,
} from '@mantine/core';
import Avatar from 'boring-avatars';
import clsx from 'clsx';
import { useState } from 'react';

type TChat = Array<{
  id: number;
  type: 'prompt' | 'completion';
  text: string;
}>;

const Convo = () => {
  const [userName, setUserName] = useState('Maria Mitchell');
  const [colors, setColors] = useState([
    '#A8E6CE',
    '#DCEDC2',
    '#FFD3B5',
    '#FFAAA6',
    '#FF8C94',
  ]);

  const [chat, setChat] = useState<TChat>([
    {
      id: 1,
      type: 'prompt',
      text: 'Hello',
    },
    {
      id: 2,
      type: 'completion',
      text: 'Yes, using the "clean all" command in DiskPart is a way to perform a hard format or low-level format of an SSD. This command will overwrite the entire SSD with zeroes, effectively erasing all data and restoring the drive to its original state. It\'s important to note that the "clean all" command is a powerful tool that should be used with caution. Once the command is executed, all data on the drive will be irretrievably lost. Additionally, the process can be time-consuming and may take several hours to complete depending on the size of the SSD ',
    },

    {
      id: 1,
      type: 'prompt',
      text: 'Hello',
    },
    {
      id: 2,
      type: 'completion',
      text: 'Yes, using the "clean all" command in DiskPart is a way to perform a hard format or low-level format of an SSD. This command will overwrite the entire SSD with zeroes, effectively erasing all data and restoring the drive to its original state. It\'s important to note that the "clean all" command is a powerful tool that should be used with caution. Once the command is executed, all data on the drive will be irretrievably lost. Additionally, the process can be time-consuming and may take several hours to complete depending on the size of the SSD ',
    },
    {
      id: 1,
      type: 'prompt',
      text: 'Hello',
    },
    {
      id: 2,
      type: 'completion',
      text: 'Yes, using the "clean all" command in DiskPart is a way to perform a hard format or low-level format of an SSD. This command will overwrite the entire SSD with zeroes, effectively erasing all data and restoring the drive to its original state. It\'s important to note that the "clean all" command is a powerful tool that should be used with caution. Once the command is executed, all data on the drive will be irretrievably lost. Additionally, the process can be time-consuming and may take several hours to complete depending on the size of the SSD ',
    },
    {
      id: 1,
      type: 'prompt',
      text: 'Hello',
    },
    {
      id: 2,
      type: 'completion',
      text: 'Yes, using the "clean all" command in DiskPart is a way to perform a hard format or low-level format of an SSD. This command will overwrite the entire SSD with zeroes, effectively erasing all data and restoring the drive to its original state. It\'s important to note that the "clean all" command is a powerful tool that should be used with caution. Once the command is executed, all data on the drive will be irretrievably lost. Additionally, the process can be time-consuming and may take several hours to complete depending on the size of the SSD Yes, using the "clean all" command in DiskPart is a way to perform a hard format or low-level format of an SSD. This command will overwrite the entire SSD with zeroes, effectively erasing all data and restoring the drive to its original state. It\'s important to note that the "clean all" command is a powerful tool that should be used with caution. Once the command is executed, all data on the drive will be irretrievably lost. Additionally, the process can be time-consuming and may take several hours to complete depending on the size of the SSD Yes, using the "clean all" command in DiskPart is a way to perform a hard format or low-level format of an SSD. This command will overwrite the entire SSD with zeroes, effectively erasing all data and restoring the drive to its original state. It\'s important to note that the "clean all" command is a powerful tool that should be used with caution. Once the command is executed, all data on the drive will be irretrievably lost. Additionally, the process can be time-consuming and may take several hours to complete depending on the size of the SSD ',
    },
  ]);

  return (
    <Stack align="center" className="w-full">
      {chat.map((item) => {
        return (
          <Center
            className={clsx('w-full p-4', {
              'bg-gray-100 dark:bg-gray-700': item.type === 'completion',
            })}
            key={item.id}
          >
            <Group
              className="w-full md:max-w-2xl lg:max-w-2xl xl:max-w-3xl"
              noWrap
            >
              <MantineAvatar className="self-start" color="green" radius="xl">
                <Avatar
                  colors={colors}
                  name={userName}
                  size={40}
                  variant="beam"
                />
              </MantineAvatar>
              <Text>{item.text}</Text>
            </Group>
          </Center>
        );
      })}
    </Stack>
  );
};

export { Convo };
