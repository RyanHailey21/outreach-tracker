import { Status, Industry, ConnectionType } from './types';

export const STATUS_CONFIG: Record<Status, { label: string; colorClass: string; dotColor: string }> = {
  [Status.ToContact]: { label: 'To Contact', colorClass: 'bg-gray-100 text-gray-800', dotColor: 'bg-gray-400' },
  [Status.MessageSent]: { label: 'Message Sent', colorClass: 'bg-blue-100 text-blue-800', dotColor: 'bg-blue-500' },
  [Status.FollowUpNeeded]: { label: 'Follow-Up Needed', colorClass: 'bg-amber-100 text-amber-800', dotColor: 'bg-amber-500' },
  [Status.InConversation]: { label: 'In Conversation', colorClass: 'bg-purple-100 text-purple-800', dotColor: 'bg-purple-500' },
  [Status.CallScheduled]: { label: 'Call Scheduled', colorClass: 'bg-green-100 text-green-800', dotColor: 'bg-green-500' },
  [Status.CallCompleted]: { label: 'Call Completed', colorClass: 'bg-teal-100 text-teal-800', dotColor: 'bg-teal-500' },
  [Status.NoResponse]: { label: 'No Response', colorClass: 'bg-red-100 text-red-800', dotColor: 'bg-red-500' },
  [Status.OnHold]: { label: 'On Hold', colorClass: 'bg-gray-200 text-gray-600', dotColor: 'bg-gray-500' },
};

export const INDUSTRY_OPTIONS = Object.values(Industry);
export const CONNECTION_TYPE_OPTIONS = Object.values(ConnectionType);
