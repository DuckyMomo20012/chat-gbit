'use client';

/* eslint-disable jsx-a11y/media-has-caption */
import { Icon } from '@iconify/react';
import {
  ActionIcon,
  Group,
  type MantineSize,
  Stack,
  Text,
} from '@mantine/core';
import {
  ComponentProps,
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
  errors: string | null;
  chunks: Array<Blob>;
};

export type TVoiceInputProps = {
  size?: MantineSize;
  iconSize?: number;
  timeout?: number;
  startElement?: React.ReactNode;
  pauseElement?: React.ReactNode;
  resumeElement?: React.ReactNode;
  stopElement?: React.ReactNode;
  clearElement?: React.ReactNode;
};

const STREAM_CONSTRAINTS = {
  audio: true,
  video: false,
} satisfies MediaStreamConstraints;

const RECORD_OPTIONS = {
  mimeType: 'audio/webm;codecs=opus',
} satisfies MediaRecorderOptions;

const VoiceInput = forwardRef(function VoiceInput(
  {
    size = 'lg',
    iconSize = 24,
    timeout,
    startElement,
    pauseElement,
    resumeElement,
    stopElement,
    clearElement,
  }: TVoiceInputProps,
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

  const StartElement = (props: ComponentProps<'div'>) => (
    <div {...props}>{startElement}</div>
  );
  const PauseElement = (props: ComponentProps<'div'>) => (
    <div {...props}>{pauseElement}</div>
  );
  const ResumeElement = (props: ComponentProps<'div'>) => (
    <div {...props}>{resumeElement}</div>
  );
  const StopElement = (props: ComponentProps<'div'>) => (
    <div {...props}>{stopElement}</div>
  );
  const ClearElement = (props: ComponentProps<'div'>) => (
    <div {...props}>{clearElement}</div>
  );

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
    };

    const startRecording = async () => {
      try {
        // NOTE: We can initialize MediaStream & MediaRecorder in the
        // useEffect() hook ONLY on first mount, but I prefer to initialize it
        // when the user clicks the start button, each start button click
        // creates a new stream
        const stream =
          await navigator.mediaDevices.getUserMedia(STREAM_CONSTRAINTS);

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

      setErrors(null);
    } else if (state === 'paused') {
      mediaRecorderRef.current?.pause();
    } else if (state === 'inactive') {
      stopRecording();
    }
  }, [state, timeout]);

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
        errors,
        chunks,
      } satisfies TVoiceInputHandle;
    },
    [state, chunks, errors],
  );

  return (
    <Stack>
      <Group>
        {state === 'inactive' &&
          chunks.length === 0 &&
          (startElement ? (
            <StartElement onClick={() => setState('recording')} />
          ) : (
            <ActionIcon
              color="indigo"
              disabled={disabled}
              onClick={() => setState('recording')}
              size={size}
              variant="outline"
            >
              <Icon
                height={iconSize}
                icon="material-symbols:mic-outline"
                width={iconSize}
              />
            </ActionIcon>
          ))}

        {state === 'inactive' && chunks.length > 0 && (
          <>
            {clearElement ? (
              <ClearElement
                onClick={() => {
                  chunksRef.current = [];
                  setChunks([]);
                  setState('inactive');
                }}
              />
            ) : (
              <ActionIcon
                color="red"
                onClick={() => {
                  chunksRef.current = [];
                  setChunks([]);
                  setState('inactive');
                }}
                size={size}
                variant="outline"
              >
                <Icon
                  height={iconSize}
                  icon="material-symbols:close-rounded"
                  width={iconSize}
                />
              </ActionIcon>
            )}

            <audio
              controls
              src={URL.createObjectURL(
                new Blob(chunks, { type: RECORD_OPTIONS.mimeType }),
              )}
            />
          </>
        )}

        {state === 'recording' &&
          (pauseElement ? (
            <PauseElement onClick={() => setState('paused')} />
          ) : (
            <ActionIcon
              color="yellow"
              onClick={() => setState('paused')}
              size={size}
              variant="outline"
            >
              <Icon
                height={iconSize}
                icon="material-symbols:pause-outline"
                width={iconSize}
              />
            </ActionIcon>
          ))}

        {state === 'paused' &&
          (resumeElement ? (
            <ResumeElement onClick={() => setState('recording')} />
          ) : (
            <ActionIcon
              color="green"
              onClick={() => setState('recording')}
              size={size}
              variant="outline"
            >
              <Icon
                height={iconSize}
                icon="material-symbols:resume-outline"
                width={iconSize}
              />
            </ActionIcon>
          ))}

        {state !== 'inactive' &&
          (stopElement ? (
            <StopElement onClick={() => setState('inactive')} />
          ) : (
            <ActionIcon
              color="red"
              onClick={() => setState('inactive')}
              size={size}
              variant="outline"
            >
              <Icon
                height={iconSize}
                icon="material-symbols:stop-outline"
                width={iconSize}
              />
            </ActionIcon>
          ))}
      </Group>

      {errors && (
        <Text c="red" className="text-center">
          {errors}
        </Text>
      )}
    </Stack>
  );
});

export { VoiceInput };
