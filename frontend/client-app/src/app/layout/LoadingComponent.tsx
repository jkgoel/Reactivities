import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

interface Props {
  inverted?: boolean;
  content?: string;
}

export default function LoadingComponent({ inverted = true, content }: Props) {
  return (
    <Dimmer active inverted={inverted}>
      <Loader content={content} />
    </Dimmer>
  );
}
