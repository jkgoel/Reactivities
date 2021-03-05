import { observer } from 'mobx-react-lite';
import React from 'react';
import { Grid, Header, Tab } from 'semantic-ui-react';
import { useStore } from 'src/app/stores/store';
import ProfileActivityList from './ProfileActivityList';

export default observer(function ProfileActivities() {
  const {
    profileStore: { setActiveSubTab },
  } = useStore();

  const panes = [
    { menuItem: 'Future', render: () => <ProfileActivityList /> },
    { menuItem: 'Past', render: () => <ProfileActivityList /> },
    { menuItem: 'Hosting', render: () => <ProfileActivityList /> },
  ];

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header content='Activities' as='h2' icon='calendar' floated='left' />
        </Grid.Column>
        <Grid.Column width={16}>
          <Tab
            menu={{ secondary: true, pointing: true }}
            panes={panes}
            onTabChange={(e, data) => setActiveSubTab(data.activeIndex)}
          />
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
