import { Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button } from 'semantic-ui-react';
import MyTextArea from 'src/app/common/form/MyTextArea';
import MyTextInput from 'src/app/common/form/MyTextInput';
import { useStore } from 'src/app/stores/store';
import * as Yup from 'yup';

interface Props {
  setEditMode: (editMode: boolean) => void;
}

export default observer(function ProfileEditForm({ setEditMode }: Props) {
  const {
    profileStore: { profile, updateProfile },
  } = useStore();
  return (
    <Formik
      onSubmit={(values) => {
        updateProfile(values).then(() => setEditMode(false));
      }}
      initialValues={{ displayName: profile?.displayName, bio: profile?.bio }}
      validationSchema={Yup.object({ displayName: Yup.string().required() })}>
      {({ handleSubmit, isValid, dirty, isSubmitting }) => (
        <Form className='ui form' onSubmit={handleSubmit}>
          <MyTextInput placeholder='Enter Display Name' name='displayName' />
          <MyTextArea placeholder='Enter Bio Information' name='bio' rows={4} />
          <Button
            type='submit'
            content='Update Profile'
            positive
            disabled={!isValid || !dirty}
            loading={isSubmitting}
            floated='right'
          />
        </Form>
      )}
    </Formik>
  );
});
