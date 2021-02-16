import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch } from 'react-router-dom';
import { useLocation } from 'react-router';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from '../../features/errors/NotFound';
import { ToastContainer } from 'react-toastify';
import TestErrors from 'src/features/errors/TestError';
import ServerError from 'src/features/errors/ServerError';

function App() {
  const location = useLocation();
  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <Route exact path='/' component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ paddingTop: '7em' }}>
              <Switch>
                <Route path='/activities' component={ActivityDashboard} exact />
                <Route path='/activities/:id' component={ActivityDetails} />
                <Route path={['/createActivity', '/manage/:id']} component={ActivityForm} key={location.key} />
                <Route path='/errors' component={TestErrors} />
                <Route path='/server-error' component={ServerError} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </>
  );
}

export default observer(App);
