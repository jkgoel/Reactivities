import { Formik, Form } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import { history } from 'src';
import MyDateInput from 'src/app/common/form/MyDateInput';
import MySelectInput from 'src/app/common/form/MySelectInput';
import MyTextArea from 'src/app/common/form/MyTextArea';
import MyTextInput from 'src/app/common/form/MyTextInput';
import { categoryOptions } from 'src/app/common/options/categoryOptions';
import LoadingComponent from 'src/app/layout/LoadingComponent';
import { ActivityFormValues } from 'src/app/model/activity';
import { useStore } from 'src/app/stores/store';
import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const { createActivity, updateActivity, loadActivity, loadingInitial } = activityStore;
  const { id } = useParams<{ id: string }>();

  const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

  const validationSchema = Yup.object({
    title: Yup.string().required(),
    description: Yup.string().required(),
    category: Yup.string().required(),
    date: Yup.string().required('date is required').nullable(),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  });

  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(new ActivityFormValues(activity)));
  }, [id, loadActivity]);

  function handleFormSubmit(activity: ActivityFormValues) {
    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
    } else {
      updateActivity(activity).then(() => history.push(`/activities/${activity.id}`));
    }
  }

  if (loadingInitial) return <LoadingComponent content='loading activity...' />;

  return (
    <Segment clearing>
      <Header sub content='Activity Details' color='teal' />
      <Formik
        enableReinitialize
        initialValues={activity}
        onSubmit={(values) => handleFormSubmit(values)}
        validationSchema={validationSchema}>
        {({ handleSubmit, isValid, dirty, isSubmitting }) => (
          <Form onSubmit={handleSubmit} autoComplete='off' className='ui form'>
            <MyTextInput name='title' placeholder='Title' />
            <MyTextArea rows={3} placeholder='Description' name='description' />
            <MySelectInput placeholder='Category' name='category' options={categoryOptions} />
            <MyDateInput
              placeholderText='Date'
              name='date'
              showTimeSelect
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm aa'
            />
            <Header sub content='Location Details' color='teal' />
            <MyTextInput placeholder='City' name='city' />
            <MyTextInput placeholder='Venue' name='venue' />
            <Button
              loading={isSubmitting}
              floated='right'
              positive
              type='submit'
              content='Submit'
              disabled={isSubmitting || !dirty || !isValid}
            />
            <Button
              as={Link}
              to={activity.id ? `/activities/${activity.id}` : '/activities'}
              floated='right'
              type='button'
              content='Cancel'
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
