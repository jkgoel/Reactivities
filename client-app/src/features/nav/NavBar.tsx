import { observer } from 'mobx-react-lite';
import React from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';
//import ActivityStore from '../../app/stores/ActivityStore';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item header as={NavLink} to='/' exact>
          <img src='/assets/logo.png' alt='logo' style={{ marginRight: 10 }} />
          Reactivities
        </Menu.Item>
        <Menu.Item name='Activities' as={NavLink} to='/activities' />
        <Menu.Item>
          <Button positive content='Create Activity' as={NavLink} to='/createactivity' />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
