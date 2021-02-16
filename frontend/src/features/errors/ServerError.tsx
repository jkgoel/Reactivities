import { observer } from 'mobx-react-lite';
import React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';
import { useStore } from 'src/app/stores/store';

export default observer(function ServerError() {
  const { commonStore } = useStore();

  return (
    <Container>
      <Header as='h1' content='Server Error' />
      <Header as='h5' color='red' content={commonStore.error?.message.toUpperCase()} />
      {commonStore.error?.details && (
        <Segment>
          <Header as='h4' content='Stack trace' color='teal' />
          <code style={{ marginTop: 10 }}>{commonStore.error?.details}</code>
        </Segment>
      )}
    </Container>
  );
});
