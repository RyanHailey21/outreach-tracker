import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Filter, Bell, Trash2, X } from 'lucide-react';
import { Contact, Status, SortState, FilterState, SortField, ToastMessage, FilterPeriod, Industry } from './types';
import { generateId, filterContacts, sortContacts, isDueToday, isOverdue } from './utils';
import { STATUS_CONFIG, INDUSTRY_OPTIONS } from './constants';

// Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DataTable from './components/DataTable';
import ContactForm from './components/ContactForm';

const App = () => {
  // --- State ---
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const { toast } = useToast()
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter & Sort
  const [sort, setSort] = useState<SortState>({ field: 'follow_up_date', order: 'asc' });
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    industry: [],
    followUp: 'all',
    search: '',
  });

  // --- Effects ---
  useEffect(() => {
    // Load data
    const saved = localStorage.getItem('outreach_contacts');
    if (saved) {
      try {
        setContacts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse contacts", e);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('outreach_contacts', JSON.stringify(contacts));
    }
  }, [contacts, isLoading]);

  // --- Actions ---
  const handleSaveContact = (contact: Contact) => {
    if (editingContact) {
      setContacts((prev) => prev.map((c) => (c.id === contact.id ? contact : c)));
      toast({ description: "Contact updated successfully" })
    } else {
      setContacts((prev) => [...prev, contact]);
      toast({ description: "Contact added successfully", variant: "default" })
    }
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const handleDeleteContact = (contact: Contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      setContacts((prev) => prev.filter((c) => c.id !== contact.id));
      setSelectedIds((prev) => prev.filter((id) => id !== contact.id));
      toast({ description: "Contact deleted", variant: "destructive" })
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedIds.length} contacts?`)) {
      setContacts((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
      toast({ description: "Contacts deleted", variant: "destructive" })
    }
  };

  const handleBulkStatusChange = (status: string) => {
    if (!status) return;
    setContacts(prev => prev.map(c => selectedIds.includes(c.id) ? { ...c, status: status as Status } : c));
    setSelectedIds([]);
    toast({ description: "Updated status for selected contacts" })
  }

  // --- Derived State ---
  const filteredContacts = useMemo(() => {
    let result = filterContacts(contacts, filters);
    return sortContacts(result, sort);
  }, [contacts, filters, sort]);

  // Pagination (Simple implementation)
  const [page, setPage] = useState(1);
  const itemsPerPage = 25;
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const paginatedContacts = filteredContacts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Alerts
  const dueTodayCount = contacts.filter(c => isDueToday(c.follow_up_date)).length;
  const overdueCount = contacts.filter(c => isOverdue(c.follow_up_date)).length;
  const showBanner = dueTodayCount > 0 || overdueCount > 0;

  // --- Handlers ---
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === paginatedContacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedContacts.map((c) => c.id));
    }
  };

  const handleSort = (field: SortField) => {
    if (sort.field === field) {
      setSort({ field, order: sort.order === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ field, order: 'asc' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Toaster />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50 h-16 px-4 md:px-8 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Outreach Tracker</h1>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block w-72 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
            <Input
              placeholder="Search contacts..."
              className="pl-10 bg-muted/20 border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all hover:bg-muted/30"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            {filters.search && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button onClick={() => { setEditingContact(null); setIsModalOpen(true); }} size="sm" className="hidden md:flex">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
          <Button onClick={() => { setEditingContact(null); setIsModalOpen(true); }} size="icon" className="md:hidden">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 pb-24 space-y-8">

        {/* Alert Banner */}
        {showBanner && (
          <div className="mb-6 bg-warning-bg/50 border border-warning/30 rounded-lg p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center text-warning-text text-sm font-medium">
              <Bell className="w-4 h-4 mr-3" />
              <span>
                {overdueCount > 0 ? `${overdueCount} overdue follow-ups.` : ''}
                {dueTodayCount > 0 ? ` ${dueTodayCount} follow-ups due today.` : ''}
              </span>
            </div>
            <button
              onClick={() => setFilters(prev => ({ ...prev, followUp: overdueCount > 0 ? 'overdue' : 'today' }))}
              className="text-xs font-semibold text-warning hover:text-warning-text underline"
            >
              View
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mb-6 flex flex-wrap gap-3 items-center">
          {/* Mobile Search */}
          <div className="w-full md:hidden mb-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-muted/20 border-muted-foreground/20"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full">
            <Select
              value={filters.followUp}
              onValueChange={(val) => setFilters(prev => ({ ...prev, followUp: val as FilterPeriod }))}
            >
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="Follow-Up" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Follow-ups</SelectItem>
                <SelectItem value="today">Due Today</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="week">Due This Week</SelectItem>
                <SelectItem value="none">No Follow-up</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status[0] || "all_statuses"}
              onValueChange={(val) => {
                const status = val === "all_statuses" ? [] : [val as Status];
                setFilters(prev => ({ ...prev, status }))
              }}
            >
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_statuses">All Statuses</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([key, conf]) => (
                  <SelectItem key={key} value={key}>{conf.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.industry[0] || "all_industries"}
              onValueChange={(val) => {
                setFilters(prev => ({
                  ...prev,
                  industry: val === "all_industries" ? [] : [val]
                }))
              }}
            >
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_industries">All Industries</SelectItem>
                {INDUSTRY_OPTIONS.map(ind => (
                  <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(filters.status.length > 0 || filters.industry.length > 0 || filters.followUp !== 'all') && (
              <button
                onClick={() => setFilters({ status: [], industry: [], followUp: 'all', search: filters.search })}
                className="text-sm text-muted-foreground hover:text-foreground whitespace-nowrap px-2"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Data Table Container */}
        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
          <DataTable
            contacts={paginatedContacts}
            selectedIds={selectedIds}
            sort={sort}
            onSort={handleSort}
            onToggleSelect={toggleSelect}
            onToggleAll={toggleAll}
            onEdit={(c) => { setEditingContact(c); setIsModalOpen(true); }}
            onDelete={handleDeleteContact}
            onRowClick={(c) => { setEditingContact(c); setIsModalOpen(true); }}
            onAdd={() => { setEditingContact(null); setIsModalOpen(true); }}
          />
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{paginatedContacts.length}</span> of <span className="font-medium text-foreground">{filteredContacts.length}</span> contacts
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || totalPages === 0}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </main>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-popover shadow-xl border border-border rounded-lg px-6 py-3 flex items-center gap-4 z-40 animate-in slide-in-from-bottom-4">
          <span className="text-sm font-medium text-foreground whitespace-nowrap">{selectedIds.length} selected</span>
          <div className="h-4 w-px bg-border"></div>

          <select
            className="h-8 text-sm border-none bg-transparent focus:ring-0 text-muted-foreground font-medium cursor-pointer"
            onChange={(e) => handleBulkStatusChange(e.target.value)}
            value=""
          >
            <option value="" disabled>Change Status</option>
            {Object.entries(STATUS_CONFIG).map(([key, conf]) => (
              <option key={key} value={key}>{conf.label}</option>
            ))}
          </select>

          <button
            onClick={handleBulkDelete}
            className="text-sm font-medium text-destructive hover:text-destructive/80 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Delete
          </button>

          <button
            onClick={() => setSelectedIds([])}
            className="ml-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg z-10 animate-in zoom-in-95 duration-200">
            <ContactForm
              initialData={editingContact || undefined}
              onSave={handleSaveContact}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
