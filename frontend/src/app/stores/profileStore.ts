import { UserActivity } from './../model/profile';
import { store } from './store';
import { makeAutoObservable, reaction, runInAction } from 'mobx';
import agent from '../api/agent';
import { Photo, Profile } from '../model/profile';

export default class ProfileStore {
  profile: Profile | null = null;
  loadingProfile = false;
  uploading = false;
  loading = false;
  deleting = false;
  followings: Profile[] = [];
  loadingFollowing = false;
  activeTab = 0;
  userActivities: UserActivity[] = [];
  activeSubTab = 0;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.activeTab,
      (activeTab) => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? 'followers' : 'following';
          this.loadFollowings(predicate);
        } else if (activeTab === 2) {
          this.loadActivities(this.activityPredicate);
        } else {
          this.followings = [];
          this.userActivities = [];
        }
      }
    );

    reaction(
      () => this.activeSubTab,
      (activeSubTab) => {
        if (this.activeTab === 2) {
          this.loadActivities(this.activityPredicate);
        } else {
          this.userActivities = [];
        }
      }
    );
  }

  setActiveTab = (activeTab: any) => {
    this.activeTab = activeTab;
  };
  setActiveSubTab = (activeSubTab: any) => {
    this.activeSubTab = activeSubTab;
  };

  get activityPredicate() {
    return this.activeSubTab === 0 ? 'future' : this.activeSubTab === 1 ? 'past' : 'hosting';
  }

  get isCurrentUser() {
    if (store.userStore.user && this.profile) {
      return store.userStore.user.username === this.profile.username;
    }
    return false;
  }

  loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => (this.loadingProfile = false));
    }
  };

  uploadPhoto = async (file: Blob) => {
    this.uploading = true;
    try {
      var resposne = await agent.Profiles.uploadPhoto(file);
      const photo = resposne.data;
      runInAction(() => {
        if (this.profile) {
          this.profile.photos?.push(photo);
          if (photo.isMain && store.userStore.user) {
            store.userStore.setImage(photo.url);
            this.profile.image = photo.url;
          }
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => (this.uploading = false));
    }
  };

  setMainPhoto = async (photo: Photo) => {
    this.loading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      store.userStore.setImage(photo.url);
      runInAction(() => {
        if (this.profile && this.profile.photos) {
          this.profile.photos.find((p) => p.isMain)!.isMain = false;
          this.profile.photos.find((p) => p.id === photo.id)!.isMain = true;
          this.profile.image = photo.url;
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  deletePhoto = async (id: string) => {
    this.deleting = true;
    try {
      await agent.Profiles.deletePhoto(id);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos = this.profile.photos?.filter((p) => p.id !== id);
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => (this.deleting = false));
    }
  };

  updateFollowing = async (username: string, following: boolean) => {
    this.loading = true;
    try {
      await agent.Profiles.updateFollowing(username);
      store.activityStore.updateAttendeeFollowing(username);
      runInAction(() => {
        if (
          this.profile &&
          this.profile.username !== store.userStore.user?.username &&
          this.profile.username === username
        ) {
          if (this.profile && this.profile.username === store.userStore.user?.username) {
            following ? this.profile.followingCount++ : this.profile.followingCount--;
          }
          following ? this.profile.followersCount++ : this.profile.followersCount--;
          this.profile.following = !this.profile.following;
        }
        this.followings.forEach((profile) => {
          if (profile.username === username) {
            profile.following ? profile.followingCount-- : profile.followingCount++;
            profile.following = !profile.following;
          }
        });
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  loadFollowings = async (predicate: string) => {
    this.loadingFollowing = true;
    try {
      const followings = await agent.Profiles.listFollowings(this.profile!.username, predicate);
      runInAction(() => {
        this.followings = followings;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => (this.loadingFollowing = false));
    }
  };

  updateProfile = async (profile: Partial<Profile>) => {
    this.loading = true;
    try {
      await agent.Profiles.updateProfile(profile);
      runInAction(() => {
        if (profile.displayName && profile.displayName !== store.userStore.user?.displayName) {
          store.userStore.setDisplayName(profile.displayName);
        }
        this.profile = { ...this.profile, ...(profile as Profile) };
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  loadActivities = async (predicate: string) => {
    this.loading = true;
    this.userActivities = [];
    try {
      if (this.profile) {
        var activities = await agent.Profiles.listActivities(this.profile.username, predicate);
        runInAction(() => {
          activities.forEach((activity) => {
            activity.date = new Date(activity.date!);
            this.userActivities.push(activity);
          });
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };
}
