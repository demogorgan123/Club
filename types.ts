// Import React to make the JSX namespace available for type definitions.
import React from 'react';

export type Role = 'Secretary' | 'Coordinator' | 'Joint Coordinator' | 'Team Head' | 'Team Co-Head' | 'Member';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  role: Role;
  teamId?: string;
  // FIX: Added optional email property to resolve type error.
  email?: string;
}

export interface Team {
  id: string;
  name: string;
  // FIX: Updated icon type to React.ElementType to be compatible with lucide-react icons.
  icon: React.ElementType;
}

export enum ChannelType {
  GENERAL = 'general',
  ANNOUNCEMENTS = 'announcements',
  TEAM = 'team',
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  teamId?: string;
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
  type: 'channel' | 'tasks' | 'apps';
  id: string; // channelId
}

export interface AppIntegration {
  name: string;
  icon: React.ElementType;
  color: string;
}