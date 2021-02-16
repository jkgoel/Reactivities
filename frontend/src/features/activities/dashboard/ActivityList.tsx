import { observer } from 'mobx-react-lite';
import React from 'react';
import { Fragment } from 'react';
import { Item, Label } from 'semantic-ui-react';
import { useStore } from 'src/app/stores/store';
import ActivityListItem from './ActivityListItem';

function ActivityList() {
  const { activityStore } = useStore();

  const { activitiesByDate } = activityStore;

  return (
    <>
      {activitiesByDate.map(([group, activities]) => (
        <Fragment key={group}>
          <Label size='large' color='blue'>
            {group}
          </Label>

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
