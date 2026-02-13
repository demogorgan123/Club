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
  icon: React.ElementType;
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
  type: 'channel' | 'tasks' | 'apps' | 'calendar';
  id: string; // channelId
}

export interface AppIntegration {
  name: string;
  icon: React.ElementType;
  color: string;
}