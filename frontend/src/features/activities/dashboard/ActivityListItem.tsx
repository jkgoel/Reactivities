import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Segment, Item, Icon, Button, Label } from 'semantic-ui-react';
import { Activity } from 'src/app/model/activity';
import ActivityListItemAttendee from './ActivityListItemAttendee';

interface Props {
  activity: Activity;
}

function ActivityListItem({ activity }: Props) {
  return (
    <Segment.Group>
      <Segment>
        {activity.isCancelled && (
          <Label attached='top' color='red' content='Cancelled' style={{ textAlign: 'Center' }} />
        )}
        <Item.Group>
          <Item>
            <Item.Image style={{ marginBottom: 3 }} size='tiny' circular src='/assets/user.png' />
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>Hosted By {activity.host?.displayName}</Item.Description>
              {activity.isHost && (
                <Item.Description>
                  <Label basic color='orange'>
                    You are hosting this activity
                  </Label>
                </Item.Description>
              )}
              {activity.isGoing && !activity.isHost && (
                <Item.Description>
                  <Label basic color='green'>
                    You are going to this activity
                  </Label>
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name='clock outline' /> {format(activity.date!, 'dd MMM yyyy h:mm aa')}
          <Icon name='map marker alternate' /> {activity.venue}, {activity.city}
        </span>
      </Segment>
      <Segment secondary>
        <ActivityListItemAttendee attendees={activity.attendees!} />
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button floated='right' content='View' color='teal' as={Link} to={`/activities/${activity.id}`} />
      </Segment>
    </Segment.Group>
  );
}

export default observer(ActivityListItem);
