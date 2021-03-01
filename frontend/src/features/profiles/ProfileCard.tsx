import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';
import { Profile } from 'src/app/model/profile';
import FollowButton from './FollowButton';

interface Props {
  profile: Profile;
}

export default observer(function ProfileCard({ profile }: Props) {
  return (
    <Card as={Link} to={`/profiles/${profile.username}`}>
      <Image src={profile.image || '/assets/user.png'} />
      <Card.Content>
        <Card.Header>{profile.displayName}</Card.Header>
        <Card.Description>{profile.bio || 'Bio goes here'}</Card.Description>
      </Card.Content>
      <Card.Content>
        <Icon name='user' />
        {profile.followersCount} Followers
      </Card.Content>
      <FollowButton profile={profile} />
    </Card>
  );
});
