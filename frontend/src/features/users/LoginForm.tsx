import { ErrorMessage, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Form, Header, Label } from 'semantic-ui-react';
import MyTextInput from 'src/app/common/form/MyTextInput';
import { useStore } from 'src/app/stores/store';

export default observer(function LoginForm() {
  const {
    userStore,
    activityStore: { loadActivities },
  } = useStore();

  return (
    <Formik
      initialValues={{ email: '', password: '', error: null }}
      onSubmit={(values, { setErrors }) =>
        userStore
          .login(values)
          .then(() => loadActivities())
          .catch((error) => setErrors({ error: error.response.data }))
      }>
      {({ handleSubmit, isSubmitting, errors }) => (
        <Form className='ui form' onSubmit={handleSubmit}>
          <Header as='h2' content='Login to Reactivities' color='teal' textAlign='center' />
          <MyTextInput name='email' placeholder='Email' />
          <MyTextInput name='password' placeholder='Password' type='password' />
          <ErrorMessage
            name='error'
            render={() => <Label style={{ marginBottom: 10 }} basic color='red' content={errors.error} />}
          />
          <Button positive content='login' type='submit' fluid loading={isSubmitting} />
        </Form>
      )}
    </Formik>
  );
});
