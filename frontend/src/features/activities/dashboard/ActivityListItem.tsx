import React from 'react';
import { Link } from 'react-router-dom';
import { Segment, Item, Icon, Button } from 'semantic-ui-react';
import { Activity } from 'src/app/model/activity';

interface Props {
  activity: Activity;
}

function ActivityListItem({ activity }: Props) {
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size='tiny' circular src='/assets/user.png' />
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>Hosted By Bob</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name='clock outline' /> {activity.date}
          <Icon name='map marker alternate' /> {activity.venue}, {activity.city}
        </span>
      </Segment>
      <Segment secondary>Attendees will go here</Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button floated='right' content='View' color='teal' as={Link} to={`/activities/${activity.id}`} />
      </Segment>
    </Segment.Group>
  );
}

export default ActivityListItem;
