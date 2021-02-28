import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { useParams } from 'react-router';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityDetailHeader from './ActivityDetailHeader';
import ActivityDetailInfo from './ActivityDetailInfo';
import ActivityDetailChat from './ActivityDetailChat';
import ActivityDetailSidebar from './ActivityDetailSidebar';
import { useStore } from 'src/app/stores/store';

function ActivityDetails() {
  const { activityStore } = useStore();
  const { selectedActivity: activity, loadActivity, loadingInitial, clearActivity } = activityStore;
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    loadActivity(id);
    return () => clearActivity();
  }, [id, loadActivity, clearActivity]);

  if (loadingInitial) return <LoadingComponent content='loading activity...' />;

  if (!activity) return <h1>Activity Not Found</h1>;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailHeader activity={activity} />
        <ActivityDetailInfo activity={activity} />
        <ActivityDetailChat activityId={activity.id} />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailSidebar activity={activity} />
      </Grid.Column>
    </Grid>
  );
}

export default observer(ActivityDetails);
