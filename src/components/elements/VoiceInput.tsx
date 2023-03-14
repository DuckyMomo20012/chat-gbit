import { Icon } from '@iconify/react';
import { Alert, Button, Group, Stack } from '@mantine/core';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

export type TVoiceInputHandle = {
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  clear: () => void;
  state: MediaRecorder['state'];
  chunks: Array<Blob>;
};

const STREAM_CONSTRAINTS = {
  audio: true,
  video: false,
} satisfies MediaStreamConstraints;

const RECORD_OPTIONS = {
  mimeType: 'audio/webm;codecs=opus',
} satisfies MediaRecorderOptions;

const VoiceInput = forwardRef(function VoiceInput(
  { playSound, timeout }: { playSound?: boolean; timeout?: number },
  ref,
) {
  const [state, setState] = useState<MediaRecorder['state']>('inactive');
  const [chunks, setChunks] = useState<Array<Blob>>([]);
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Array<Blob>>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // NOTE: Check if the browser supports MediaRecorder API
    if (!navigator.mediaDevices) {
      setDisabled(true);
    }
  }, []);

  useEffect(() => {
    const handleStart = () => {
      // NOTE: Clear chunks array only when new recording starts, so when the
      // component rerender the data still available. This is intentional.
      chunksRef.current = [];
      setChunks([]);

      if (timeout) {
        const timer = setTimeout(() => {
          setState('inactive');
        }, timeout);

        timerRef.current = timer;
      }
    };

    const handleDataAvailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        // NOTE: Don't mutate the chunksRef.current array!!!
        chunksRef.current = [...chunksRef.current, event.data];
      }
    };

    const handleStop = () => {
      setChunks(chunksRef.current);

      // NOTE: Set state to inactive to handle unexpected stop event, (e.g.
      // when the media stream being captured ends unexpectedly)
      setState('inactive');

      if (playSound) {
        const blob = new Blob(chunksRef.current, {
          type: RECORD_OPTIONS.mimeType,
        });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
      }
    };

    const startRecording = async () => {
      try {
        // NOTE: We can initialize MediaStream & MediaRecorder in the
        // useEffect() hook ONLY on first mount, but I prefer to initialize it
        // when the user clicks the start button, each start button click
        // creates a new stream
        const stream = await navigator.mediaDevices.getUserMedia(
          STREAM_CONSTRAINTS,
        );

        const recorder = new MediaRecorder(stream, RECORD_OPTIONS);

        recorder.addEventListener('start', handleStart);
        recorder.addEventListener('dataavailable', handleDataAvailable);
        recorder.addEventListener('stop', handleStop);

        recorder.start();

        mediaRecorderRef.current = recorder;
        mediaStreamRef.current = stream;
      } catch (error: unknown) {
        setState('inactive');
        setErrors((error as Error).message);
      }
    };

    const stopRecording = () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.removeEventListener('start', handleStart);
        mediaRecorderRef.current.removeEventListener(
          'dataavailable',
          handleDataAvailable,
        );
        mediaRecorderRef.current.removeEventListener('stop', handleStop);

        // NOTE: Call stop() after removing event listeners because after
        // stop(), the MediaRecorder object will stop accepting new events.
        mediaRecorderRef.current.stop();

        mediaRecorderRef.current = null;
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        mediaStreamRef.current = null;
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    if (state === 'recording') {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.resume();
      } else {
        startRecording();
      }
    } else if (state === 'paused') {
      mediaRecorderRef.current?.pause();
    } else if (state === 'inactive') {
      stopRecording();
    }
  }, [state, playSound, timeout]);

  useImperativeHandle(
    ref,
    () => {
      // NOTE: We can receive callback functions (e.g. onStart, onPause, etc.)
      // from parent component, but to me it's quite complicated. So I pass a
      // ref back to the parent.
      return {
        start: () => setState('recording'),
        pause: () => setState('paused'),
        resume: () => setState('recording'),
        stop: () => setState('inactive'),
        clear: () => {
          chunksRef.current = [];
          setChunks([]);
          setState('inactive');
        },
        state,
        chunks,
      } satisfies TVoiceInputHandle;
    },
    [state, chunks],
  );

  return (
    <Stack>
      {errors && (
        <Alert
          color="red"
          onClose={() => setErrors(null)}
          title="Error"
          withCloseButton
        >
          {errors}
        </Alert>
      )}
      {state === 'inactive' && (
        <Button
          color="indigo"
          disabled={disabled}
          leftIcon={
            <Icon height={24} icon="material-symbols:mic-outline" width={24} />
          }
          onClick={() => setState('recording')}
          variant="light"
        >
          Start recording
        </Button>
      )}
      {state !== 'inactive' && (
        <Group>
          <Button
            color={state === 'paused' ? 'yellow' : 'green'}
            leftIcon={
              <Icon
                height={24}
                icon={
                  state === 'paused'
                    ? 'material-symbols:resume-outline'
                    : 'material-symbols:pause-outline'
                }
                width={24}
              />
            }
            onClick={() =>
              setState(state === 'paused' ? 'recording' : 'paused')
            }
            variant="light"
          >
            {state === 'paused' ? 'Resume' : 'Pause'}
          </Button>
          <Button
            color="red"
            leftIcon={
              <Icon
                height={24}
                icon="material-symbols:stop-outline"
                width={24}
              />
            }
            onClick={() => setState('inactive')}
            variant="light"
          >
            Stop
          </Button>
        </Group>
      )}
    </Stack>
  );
});

export { VoiceInput };
