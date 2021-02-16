import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from 'src/app/layout/LoadingComponent';
import { useStore } from 'src/app/stores/store';
import ActivityList from './ActivityList';

function ActivityDashboard() {
  const { activityStore } = useStore();

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <LoadingComponent content='loading activities...' />;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width={6}>
        <h2>Activity Fillters</h2>
      </Grid.Column>
    </Grid>
  );
}

export default observer(ActivityDashboard);
