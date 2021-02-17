import { observer } from 'mobx-react-lite';
import React from 'react';
import { Fragment } from 'react';
import { Header, Item } from 'semantic-ui-react';
import { useStore } from 'src/app/stores/store';
import ActivityListItem from './ActivityListItem';

function ActivityList() {
  const { activityStore } = useStore();

  const { groupedActivities } = activityStore;

  return (
    <>
      {groupedActivities.map(([group, activities]) => (
        <Fragment key={group}>
          <Header sub color='teal'>
            {group}
          </Header>

          <Item.Group divided>
            {activities.map((activity) => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </Item.Group>
        </Fragment>
      ))}
    </>
  );
}

export default observer(ActivityList);
