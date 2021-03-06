import React, { Fragment, useEffect } from 'react';
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
import { useStore } from '../stores/store';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modal/ModalContainer';
import ProfilePage from 'src/features/profiles/ProfilePage';
import PrivateRoute from './PrivateRoute';

function App() {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [userStore, commonStore]);

  if (!commonStore.appLoaded) return <LoadingComponent content='Loading app...' />;
  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer />
      <Route exact path='/' component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ paddingTop: '7em' }}>
              <Switch>
                <PrivateRoute path='/activities' component={ActivityDashboard} exact />
                <PrivateRoute path='/activities/:id' component={ActivityDetails} />
                <PrivateRoute path={['/createActivity', '/manage/:id']} component={ActivityForm} key={location.key} />
                <PrivateRoute path='/profiles/:username' component={ProfilePage} />
                <PrivateRoute path='/errors' component={TestErrors} />
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
