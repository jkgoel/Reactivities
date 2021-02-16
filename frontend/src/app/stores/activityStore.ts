import { Activity } from '../model/activity';
import { makeAutoObservable, runInAction } from 'mobx';
import { SyntheticEvent } from 'react';
import agent from '../api/agent';
import { v4 as uuid } from 'uuid';

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  activity: Activity | undefined = undefined;
  loadingInitial = true;
  loading = false;
  editMode = false;

  target = '';

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
  }

  groupActivitiesByDate(activities: Activity[]) {
    const sortedActivities = activities.slice().sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.split('T')[0];
        activities[date] = activities[date] ? [...activities[date], activity] : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction(() => {
        activities.forEach((activity) => {
          activity.date = activity.date.split('T')[0];
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
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  clearActivity = () => {
    this.activity = undefined;
  };

  createActivity = async (activity: Activity) => {
    this.loading = true;
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.loading = false;
      });
    }
  };

  editActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.loading = false;
      });
    }
  };

  deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.loading = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.activity = undefined;
        this.loading = false;
        this.target = '';
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.loading = false;
        this.target = '';
      });
    }
  };
}
