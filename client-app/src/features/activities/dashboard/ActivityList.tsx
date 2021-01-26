import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useEffect } from 'react';
import { Item, Label } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityStore from '../../../app/stores/ActivityStore';
import ActivityListItem from './ActivityListItem';

const ActivityList = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <LoadingComponent content='Loadng activities' />;

  const { activitiesByDate } = activityStore;
  return (
    <Fragment>
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
    </Fragment>
  );
};

export default observer(ActivityList);
