import { store } from './store';
import { makeAutoObservable, runInAction } from 'mobx';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { ChatComment } from './../model/comment';

export default class CommentStore {
  comments: ChatComment[] = [];
  hubConnection: HubConnection | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  createHubConnection = async (activityId: string) => {
    if (store.activityStore.selectedActivity) {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl('https://localhost:5001/chat?activityId=' + activityId, {
          accessTokenFactory: () => store.userStore.user?.token!,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      this.hubConnection.start().catch((error) => console.error('Error establishing the connection: ', error));

      this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {
        runInAction(() => (this.comments = comments));
      });

      this.hubConnection.on('RecievedComment', (comment: ChatComment) => {
        runInAction(() => this.comments.push(comment));
      });
    }
  };

  stopHubConnection = () => {
    this.hubConnection?.stop().catch((error) => console.error('Error stopping connection: ', error));
  };

  clearComments = () => {
    this.comments = [];
    this.stopHubConnection();
  };

  addComment = async (values: any) => {
    values.activityId = store.activityStore.selectedActivity?.id;
    try {
      await this.hubConnection?.invoke('SendComment', values);
    } catch (error) {
      console.error(error);
    }
  };
}