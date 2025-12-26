export enum Status {
  ToContact = 'to_contact',
  MessageSent = 'message_sent',
  FollowUpNeeded = 'follow_up_needed',
  InConversation = 'in_conversation',
  CallScheduled = 'call_scheduled',
  CallCompleted = 'call_completed',
  NoResponse = 'no_response',
  OnHold = 'on_hold',
}

export enum Industry {
  SaaS = 'SaaS',
  Manufacturing = 'Manufacturing',
  MedicalDevices = 'Medical Devices',
  IndustrialAutomation = 'Industrial Automation',
  Robotics = 'Robotics',
  Semiconductors = 'Semiconductors',
  Energy = 'Energy',
  Consulting = 'Consulting',
  Other = 'Other',
}

export enum ConnectionType {
  Cold = 'Cold',
  WarmIntro = 'Warm Intro',
  Alumni = 'Alumni',
  Referral = 'Referral',
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  industry?: Industry | string;
  linkedin_url: string;
  date_messaged?: string; // ISO Date
  status: Status;
  follow_up_date?: string; // ISO Date
  notes?: string;
  connection_type?: ConnectionType | string;
  response_received: boolean;
  call_scheduled: boolean;
  call_date?: string; // ISO Datetime
  created_at: number;
  updated_at: number;
}

export type SortField = 'follow_up_date' | 'name' | 'company' | 'status' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  order: SortOrder;
}

export type FilterPeriod = 'all' | 'today' | 'overdue' | 'week' | 'none';

export interface FilterState {
  status: Status[];
  industry: string[];
  followUp: FilterPeriod;
  search: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
