import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TChat } from '@/components/elements/Message';

const initialState: Array<TChat> = [
  {
    id: '1',
    type: 'prompt',
    text: 'Hello',
    isTyping: false,
  },
  {
    id: '2',
    type: 'completion',
    text: 'Yes, using the "clean all" command in DiskPart is a way to perform a hard format or low-level format of an SSD. This command will overwrite the entire SSD with zeroes, effectively erasing all data and restoring the drive to its original state. It\'s important to note that the "clean all" command is a powerful tool that should be used with caution. Once the command is executed, all data on the drive will be irretrievably lost. Additionally, the process can be time-consuming and may take several hours to complete depending on the size of the SSD ',
    isTyping: false,
  },

  // {
  //   id: '3',
  //   type: 'prompt',
  //   text: 'Hello',
  // },
  // {
  //   id: '4',
  //   type: 'completion',
  //   text: 'Yes, using the "clean all" command in DiskPart is a way to perform a hard format or low-level format of an SSD. This command will overwrite the entire SSD with zeroes, effectively erasing all data and restoring the drive to its original state. It\'s important to note that the "clean all" command is a powerful tool that should be used with caution. Once the command is executed, all data on the drive will be irretrievably lost. Additionally, the process can be time-consuming and may take several hours to complete depending on the size of the SSD ',
  // },
  // {
  //   id: '5',
  //   type: 'prompt',
  //   text: 'Hello',
  // },
  // {
  //   id: '6',
  //   type: 'completion',
  //   text: 'Yes, using the "clean all" command in DiskPart is a way to perform a hard format or low-level format of an SSD. This command will overwrite the entire SSD with zeroes, effectively erasing all data and restoring the drive to its original state. It\'s important to note that the "clean all" command is a powerful tool that should be used with caution. Once the command is executed, all data on the drive will be irretrievably lost. Additionally, the process can be time-consuming and may take several hours to complete depending on the size of the SSD ',
  // },
  // {
  //   id: '7',
  //   type: 'prompt',
  //   text: 'Hello',
  // },
  // {
  //   id: '8',
  //   type: 'completion',
  //   text: 'Yes, using the "clean all" command in DiskPart is a way to perform a hard format or low-level format of an SSD. This command will overwrite the entire SSD with zeroes, effectively erasing all data and restoring the drive to its original state. It\'s important to note that the "clean all" command is a powerful tool that should be used with caution. Once the command is executed, all data on the drive will be irretrievably lost. Additionally, the process can be time-consuming and may take several hours to complete depending on the size of the SSD Yes, using the "clean all" command in DiskPart is a way to perform a hard format or low-level format of an SSD. This command will overwrite the entire SSD with zeroes, effectively erasing all data and restoring the drive to its original state. It\'s important to note that the "clean all" command is a powerful tool that should be used with caution. Once the command is executed, all data on the drive will be irretrievably lost. Additionally, the process can be time-consuming and may take several hours to complete depending on the size of the SSD Yes, using the "clean all" command in DiskPart is a way to perform a hard format or low-level format of an SSD. This command will overwrite the entire SSD with zeroes, effectively erasing all data and restoring the drive to its original state. It\'s important to note that the "clean all" command is a powerful tool that should be used with caution. Once the command is executed, all data on the drive will be irretrievably lost. Additionally, the process can be time-consuming and may take several hours to complete depending on the size of the SSD ',
  // },
];

const convoSlice = createSlice({
  name: 'convo',
  initialState,
  reducers: {
    addMessage: (
      state,
      action: PayloadAction<{
        type: TChat['type'];
        text: string;
        isTyping: boolean;
      }>,
    ) => {
      const { payload } = action;

      state.push({
        id: nanoid(),
        type: payload.type,
        text: payload.text,
        isTyping: payload.isTyping,
      });
    },
    mutateMessage: (
      state,
      action: PayloadAction<{
        id: TChat['id'];
        mutation: Partial<TChat>;
      }>,
    ) => {
      const { payload } = action;

      const message = state.find((m) => m.id === payload.id);

      if (message) {
        Object.assign(message, { ...message, ...payload.mutation });
      }
    },
  },
});

export const { addMessage, mutateMessage } = convoSlice.actions;

export default convoSlice.reducer;
