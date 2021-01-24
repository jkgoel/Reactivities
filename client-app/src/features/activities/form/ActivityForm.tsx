import React, { FormEvent, useContext } from 'react';
import { useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { IActivity } from '../../../app/model/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/ActivityStore';
import { observer } from 'mobx-react-lite';

interface IProps {
  activity: IActivity;
}

const ActivityForm: React.FC<IProps> = ({ activity: InitialFormState }) => {
  const activityStore = useContext(ActivityStore);
  const { createActivity, editActivity, closeActivityForm, submitting } = activityStore;

  const initializeForm = () => {
    if (InitialFormState) {
      return InitialFormState;
    } else {
      return {
        id: '',
        title: '',
        description: '',
        category: '',
        date: '',
        city: '',
        venue: '',
      };
    }
  };

  const [activity, setActivity] = useState<IActivity>(initializeForm);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (activity.id.length === 0) {
      let newActivity = { ...activity, id: uuid() };
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };
  const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  return (
    <Segment clearing>
      <Form>
        <Form.Input onChange={handleInputChange} name='title' placeholder='Title' value={activity.title} />
        <Form.TextArea
          rows={2}
          placeholder='Description'
          value={activity.description}
          onChange={handleInputChange}
          name='description'
        />
        <Form.Input placeholder='Category' value={activity.category} onChange={handleInputChange} name='category' />
        <Form.Input
          type='datetime-local'
          placeholder='Date'
          value={activity.date}
          onChange={handleInputChange}
          name='date'
        />
        <Form.Input placeholder='City' value={activity.city} onChange={handleInputChange} name='city' />
        <Form.Input placeholder='Venue' value={activity.venue} onChange={handleInputChange} name='venue' />
        <Button
          floated='right'
          positive
          type='submit'
          content='Submit'
          onClick={(e) => handleSubmit(e)}
          loading={submitting}
        />
        <Button floated='right' type='button' content='Cancel' onClick={() => closeActivityForm()} />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
