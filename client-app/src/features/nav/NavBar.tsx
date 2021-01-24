import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';
import ActivityStore from '../../app/stores/ActivityStore';

const NavBar = () => {
  const activityStore = useContext(ActivityStore);
  return (
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item header>
          <img src='/assets/logo.png' alt='logo' style={{ marginRight: 10 }} />
          Reactivities
        </Menu.Item>
        <Menu.Item name='Activities' />
        <Menu.Item>
          <Button positive content='Create Activity' onClick={() => activityStore.openActivityForm(true)} />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
