import { Formik, Form } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Header, Button, Comment } from 'semantic-ui-react';
import MyTextArea from 'src/app/common/form/MyTextArea';
import { useStore } from 'src/app/stores/store';
import * as Yup from 'yup';

interface Props {
  activityId: string;
}

function ActivityDetailChat({ activityId }: Props) {
  const { commentStore } = useStore();

  useEffect(() => {
    if (activityId) {
      commentStore.createHubConnection(activityId);
    }

    return () => {
      commentStore.stopHubConnection();
    };
  }, [activityId, commentStore]);

  return (
    <>
      <Segment textAlign='center' attached='top' inverted color='teal' style={{ border: 'none' }}>
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached clearing>
        <Comment.Group>
          {commentStore.comments.map((comment) => (
            <Comment key={comment.id}>
              <Comment.Avatar src={comment.image || '/assets/user.png'} />
              <Comment.Content>
                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>
                  {comment.displayName}
                </Comment.Author>
                <Comment.Metadata>
                  <div>{comment.createdAt}</div>
                </Comment.Metadata>
                <Comment.Text>{comment.body}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))}

          <Formik
            onSubmit={(values, { resetForm }) => commentStore.addComment(values).then(() => resetForm())}
            initialValues={{ body: '' }}
            validationSchema={Yup.object({ body: Yup.string().required() })}>
            {({ isSubmitting, isValid }) => (
              <Form className='ui form'>
                <MyTextArea placeholder='Add comment' rows={2} name='body' />
                <Button
                  content='Add Reply'
                  labelPosition='left'
                  icon='edit'
                  primary
                  loading={isSubmitting}
                  disabled={isSubmitting || !isValid}
                  type='submit'
                  floated='right'
                />
              </Form>
            )}
          </Formik>
        </Comment.Group>
      </Segment>
    </>
  );
}

export default observer(ActivityDetailChat);
