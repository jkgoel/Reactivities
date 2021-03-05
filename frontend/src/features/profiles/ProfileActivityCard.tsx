import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Image } from 'semantic-ui-react';
import { UserActivity } from 'src/app/model/profile';

interface Props {
  activity: UserActivity;
}
export default observer(function ProfileActivityCard({ activity }: Props) {
  return (
    <Card as={Link} to={`/activities/${activity.id}`} key={activity.id}>
      <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
      <Card.Content textAlign='center'>
        <Card.Header>{activity.title}</Card.Header>
        {activity.date && (
          <>
            <Card.Description>{format(activity.date, 'dd MMM yyyy')}</Card.Description>
            <Card.Description>{format(activity.date, 'h:mm aa')}</Card.Description>
          </>
        )}
      </Card.Content>
    </Card>
  );
});
