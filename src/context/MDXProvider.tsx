/* eslint-disable @typescript-eslint/no-explicit-any */
import { CodeHighlight } from '@mantine/code-highlight';
import {
  Anchor,
  Blockquote,
  Code,
  Divider,
  Image,
  Text,
  Title,
} from '@mantine/core';
import { MDXProvider as BaseMDXProvider } from '@mdx-js/react';

const components = {
  a: Anchor,
  blockquote: Blockquote,
  code: (props: any) => {
    return <Code {...props} />;
  },
  em: (props: any) => <Text {...props} italic />,
  h1: (props: any) => {
    return <Title {...props} order={1} />;
  },
  h2: (props: any) => {
    return <Title {...props} order={2} />;
  },
  h3: (props: any) => {
    return <Title {...props} order={3} />;
  },
  h4: (props: any) => {
    return <Title {...props} order={4} />;
  },
  h5: (props: any) => {
    return <Title {...props} order={5} />;
  },
  h6: (props: any) => {
    return <Title {...props} order={6} />;
  },
  hr: () => {
    return <Divider my="sm" />;
  },
  img: (props: any) => {
    return <Image {...props} />;
  },
  p: Text,
  pre: (props: any) => {
    const language =
      props.children?.props?.className?.replace(/language-/, '') || '';
    return (
      <CodeHighlight
        code={props.children?.props?.children || ''}
        language={language}
      />
    );
  },
  strong: (props: any) => <Text {...props} weight="bold" />,
};

const MDXProvider = ({ children }: { children?: React.ReactNode }) => {
  return (
    <BaseMDXProvider components={components as any}>{children}</BaseMDXProvider>
  );
};

export { MDXProvider };
