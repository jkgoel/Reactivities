import React from 'react';
import { Link } from 'react-router-dom';
import { Image, List, Popup } from 'semantic-ui-react';
import { Profile } from 'src/app/model/profile';
import ProfileCard from 'src/features/profiles/ProfileCard';

interface Props {
  attendees: Profile[];
}

export default function ActivityListItemAttendee({ attendees }: Props) {
  return (
    <List horizontal>
      {attendees.map((attendee) => (
        <Popup
          hoverable
          key={attendee.username}
          trigger={
            <List.Item key={attendee.username} as={Link} to={`/profile/${attendee.username}`}>
              <Image size='mini' circular src={attendee.image || '/assets/user.png'} />
            </List.Item>
          }>
          <Popup.Content>
            <ProfileCard profile={attendee} />
          </Popup.Content>
        </Popup>
      ))}
    </List>
  );
}
