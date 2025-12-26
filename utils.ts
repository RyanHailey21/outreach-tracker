import { Contact, SortState, FilterState } from './types';

export const generateId = (): string => {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const isSameYear = date.getFullYear() === now.getFullYear();
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: isSameYear ? undefined : 'numeric',
  });
};

export const isOverdue = (dateString?: string): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const isDueToday = (dateString?: string): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isDueThisWeek = (dateString?: string): boolean => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0,0,0,0);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return date >= today && date <= nextWeek;
}

export const filterContacts = (contacts: Contact[], filters: FilterState): Contact[] => {
  return contacts.filter((contact) => {
    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        contact.name.toLowerCase().includes(q) ||
        contact.title.toLowerCase().includes(q) ||
        contact.company.toLowerCase().includes(q) ||
        (contact.notes && contact.notes.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Status
    if (filters.status.length > 0 && !filters.status.includes(contact.status)) {
      return false;
    }

    // Industry
    if (filters.industry.length > 0 && (!contact.industry || !filters.industry.includes(contact.industry))) {
      return false;
    }

    // Follow Up
    if (filters.followUp !== 'all') {
      if (filters.followUp === 'none') {
        if (contact.follow_up_date) return false;
      } else if (filters.followUp === 'today') {
        if (!isDueToday(contact.follow_up_date)) return false;
      } else if (filters.followUp === 'overdue') {
        if (!isOverdue(contact.follow_up_date)) return false;
      } else if (filters.followUp === 'week') {
         if (!isDueThisWeek(contact.follow_up_date)) return false;
      }
    }

    return true;
  });
};

export const sortContacts = (contacts: Contact[], sort: SortState): Contact[] => {
  return [...contacts].sort((a, b) => {
    const fieldA = a[sort.field];
    const fieldB = b[sort.field];

    // Handle nulls always at the end
    if (fieldA === fieldB) return 0;
    if (fieldA === undefined || fieldA === null) return 1;
    if (fieldB === undefined || fieldB === null) return -1;

    let comparison = 0;
    if (fieldA < fieldB) comparison = -1;
    if (fieldA > fieldB) comparison = 1;

    return sort.order === 'asc' ? comparison : -comparison;
  });
};
