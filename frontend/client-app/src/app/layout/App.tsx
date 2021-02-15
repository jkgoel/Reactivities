import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from 'src/features/activities/dashboard/ActivityDashboard';
import { Activity } from '../model/activity';
import NavBar from './NavBar';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    axios.get<Activity[]>('https://localhost:5001/api/activities').then((response) => {
      setActivities(response.data);
    });
  }, []);

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: '6em' }}>
        <ActivityDashboard activities={activities} />
      </Container>
    </>
  );
}

export default App;
