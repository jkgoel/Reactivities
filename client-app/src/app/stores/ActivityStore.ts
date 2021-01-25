import { IActivity } from './../model/activity';
import { makeAutoObservable, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import agent from '../api/agent';

class ActivityStore {
  constructor() {
    makeAutoObservable(this);
  }

  activityRegistry = new Map();
  activity: IActivity | null = null;
  loadingInitial = true;
  editMode = false;
  submitting = false;
  target = '';

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values())
      .slice()
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction(() => {
        activities.forEach((activity) => {
          activity.date = activity.date.split('.')[0];
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loadingInitial = false;
      });
    }
  };

  selectActivity = (id: string) => {
    this.activity = this.activityRegistry.get(id);
    this.editMode = false;
  };

  loadActivity = async (id: string) => {
    this.activity = this.activityRegistry.get(id);
    if (!this.activity) {
      this.loadingInitial = true;
      try {
        const response = await agent.Activities.details(id);
        runInAction(() => {
          this.activity = response;
          this.loadingInitial = false;
        });
      } catch (error) {
        runInAction(() => {
          console.log(error);
          this.loadingInitial = false;
        });
      }
    }
  };

  clearActivity = () => {
    this.activity = null;
  };

  createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.submitting = false;
      });
    }
  };

  editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.submitting = false;
      });
    }
  };

  deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.activity = null;
        this.submitting = false;
        this.target = '';
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.submitting = false;
        this.target = '';
      });
    }
  };
}

export default createContext(new ActivityStore());
