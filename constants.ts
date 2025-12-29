import { Status, Industry, ConnectionType } from './types';

export const STATUS_CONFIG: Record<Status, { label: string; colorClass: string; dotColor: string }> = {
  [Status.ToContact]: { label: 'To Contact', colorClass: 'bg-status-neutral/20 text-status-neutral', dotColor: 'bg-status-neutral' },
  [Status.MessageSent]: { label: 'Message Sent', colorClass: 'bg-status-info/20 text-status-info', dotColor: 'bg-status-info' },
  [Status.FollowUpNeeded]: { label: 'Follow-Up Needed', colorClass: 'bg-status-warning/20 text-status-warning', dotColor: 'bg-status-warning' },
  [Status.InConversation]: { label: 'In Conversation', colorClass: 'bg-status-engaged/20 text-status-engaged', dotColor: 'bg-status-engaged' },
  [Status.CallScheduled]: { label: 'Call Scheduled', colorClass: 'bg-status-success/20 text-status-success', dotColor: 'bg-status-success' },
  [Status.CallCompleted]: { label: 'Call Completed', colorClass: 'bg-status-completed/20 text-status-completed', dotColor: 'bg-status-completed' },
  [Status.NoResponse]: { label: 'No Response', colorClass: 'bg-status-error/20 text-status-error', dotColor: 'bg-status-error' },
  [Status.OnHold]: { label: 'On Hold', colorClass: 'bg-status-neutral/10 text-status-neutral/70', dotColor: 'bg-status-neutral/70' },
};

export const INDUSTRY_OPTIONS = Object.values(Industry);
export const CONNECTION_TYPE_OPTIONS = Object.values(ConnectionType);
