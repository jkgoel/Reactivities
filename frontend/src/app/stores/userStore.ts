import { history } from 'src';
import { store } from './store';
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { User, UserFormValues } from './../model/user';

export default class userStore {
  user: User | null = null;
  fbAccessToken: string | null = null;
  fbLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.login(creds);
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
      history.push('/activities');
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };

  logout = () => {
    store.commonStore.setToken(null);
    window.localStorage.removeItem('jwt');
    this.user = null;
    history.push('/');
  };

  getUser = async () => {
    try {
      const user = await agent.Account.current();
      runInAction(() => (this.user = user));
    } catch (error) {
      console.error(error);
    }
  };

  register = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.register(creds);
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
      history.push('/activities');
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };

  setImage = (image: string) => {
    if (this.user) this.user.image = image;
  };

  setDisplayName = (name: string) => {
    if (this.user) this.user.displayName = name;
  };

  getFacebookLoginStatus = async () => {
    window.FB.getLoginStatus((resposne) => {
      if (resposne.status === 'connected') {
        this.fbAccessToken = resposne.authResponse.accessToken;
      }
    });
  };

  facebookLogin = () => {
    this.fbLoading = true;

    const apiLogin = (accessToken: string) => {
      agent.Account.fbLogin(accessToken)
        .then((user) => {
          store.commonStore.setToken(user.token);
          runInAction(() => {
            this.user = user;
            this.fbLoading = false;
          });
          history.push('/activities');
        })
        .catch((error) => {
          console.error(error);
          runInAction(() => (this.fbLoading = false));
        });
    };
    if (this.fbAccessToken) {
      apiLogin(this.fbAccessToken);
    } else {
      window.FB.login(
        (resposne) => {
          apiLogin(resposne.authResponse.accessToken);
        },
        { scope: 'public_profile,email' }
      );
    }
  };
}
