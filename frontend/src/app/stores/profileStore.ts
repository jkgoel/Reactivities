import { store } from './store';
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Photo, Profile } from '../model/profile';

export default class ProfileStore {
  profile: Profile | null = null;
  loadingProfile = false;
  uploading = false;
  loading = false;
  deleting = false;

  constructor() {
    makeAutoObservable(this);
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
}
