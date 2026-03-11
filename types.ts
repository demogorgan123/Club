import React from 'react';

export type Role = 'Secretary' | 'Coordinator' | 'Joint Coordinator' | 'Team Head' | 'Team Co-Head' | 'Member';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  role: Role;
  teamId?: string;
  email?: string;
}

export interface Team {
  id: string;
  name: string;
  iconId: string;
}

export enum ChannelType {
  GENERAL = 'general',
  ANNOUNCEMENTS = 'announcements',
  TEAM = 'team',
  DIRECT = 'direct',
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  teamId?: string;
  memberIds?: string[];
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  userId: string;
  reactions?: { [emoji: string]: string[] }; // emoji -> list of userIds
  isEdited?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  teamId?: string;
  attendees: string[]; // list of userIds
  budget?: number;
  expenses?: Expense[];
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
}

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // userId
  status: TaskStatus;
  dueDate?: string;
}

export interface ActiveView {
  type: 'channel' | 'tasks' | 'apps' | 'calendar' | 'events';
  id: string; // channelId or viewId
}

export interface AppIntegration {
  name: string;
  iconId: string;
  color: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'task_assignment' | 'task_overdue' | 'mention';
  read: boolean;
  timestamp: string;
  link?: { type: 'channel' | 'tasks' | 'calendar'; id: string };
}
