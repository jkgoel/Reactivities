import { observer } from 'mobx-react-lite';
import React from 'react';
import { Card, Tab } from 'semantic-ui-react';
import { useStore } from 'src/app/stores/store';
import ProfileActivityCard from './ProfileActivityCard';

export default observer(function ProfileActivityList() {
  const {
    profileStore: { userActivities, loading },
  } = useStore();

  return (
    <Tab.Pane loading={loading}>
      <Card.Group itemsPerRow={4}>
        {userActivities.map((activity) => (
          <ProfileActivityCard activity={activity} />
        ))}
      </Card.Group>
    </Tab.Pane>
  );
});
