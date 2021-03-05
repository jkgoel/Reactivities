import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, Header, Tab, TabProps, Image } from 'semantic-ui-react';
import { UserActivity } from 'src/app/model/profile';
import { useStore } from 'src/app/stores/store';

const panes = [
  { menuItem: 'Future Events', pane: { key: 'future' } },
  { menuItem: 'Past Events', pane: { key: 'past' } },
  { menuItem: 'Hosting', pane: { key: 'hosting' } },
];

export default observer(function ProfileActivities() {
  const {
    profileStore: { loadActivities, profile, loading, userActivities },
  } = useStore();

  useEffect(() => {
    loadActivities(profile!.username);
  }, [loadActivities, profile]);

  const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
    loadActivities(profile!.username, panes[data.activeIndex as number].pane.key);
  };

  return (
    <Tab.Pane loading={loading}>
      <Grid>
        <Grid.Column width={16}>
          <Header content='Activities' as='h2' icon='calendar' floated='left' />
        </Grid.Column>
        <Grid.Column width={16}>
          <Tab
            menu={{ secondary: true, pointing: true }}
            panes={panes}
            onTabChange={(e, data) => handleTabChange(e, data)}
          />
          <br />
          <Card.Group itemsPerRow={4}>
            {userActivities.map((activity: UserActivity) => (
              <Card as={Link} to={`/activities/${activity.id}`} key={activity.id}>
                <Image
                  src={`/assets/categoryImages/${activity.category}.jpg`}
                  style={{ minHeight: 100, objectFit: 'cover' }}
                />
                <Card.Content>
                  <Card.Header textAlign='center'>{activity.title}</Card.Header>
                  <Card.Meta textAlign='center'>
                    <div>{format(new Date(activity.date), 'do LLL')}</div>
                    <div>{format(new Date(activity.date), 'h:mm a')}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
