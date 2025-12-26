import React from 'react';
import { Contact, SortState, SortField } from '../types';
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from './StatusBadge';
import { formatDate, isOverdue, isDueToday } from '../utils';
import { ArrowUp, ArrowDown, Edit2, Trash2, MoreHorizontal, User, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface DataTableProps {
  contacts: Contact[];
  selectedIds: string[];
  sort: SortState;
  onSort: (field: SortField) => void;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onRowClick: (contact: Contact) => void;
  onAdd: () => void;
}

const DataTable: React.FC<DataTableProps> = ({
  contacts,
  selectedIds,
  sort,
  onSort,
  onToggleSelect,
  onToggleAll,
  onEdit,
  onDelete,
  onRowClick,
  onAdd,
}) => {
  const allSelected = contacts.length > 0 && selectedIds.length === contacts.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < contacts.length;

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sort.field !== field) return null;
    return sort.order === 'asc' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />;
  };

  const TableHeadSortable = ({ label, field, className }: { label: string; field?: SortField; className?: string }) => (
    <TableHead
      className={`cursor-pointer hover:bg-muted/50 transition-colors ${className}`}
      onClick={() => field && onSort(field)}
    >
      <div className="flex items-center">
        {label}
        {field && <SortIcon field={field} />}
      </div>
    </TableHead>
  );

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-card rounded-lg border border-border">
        <div className="bg-muted p-4 rounded-full mb-4">
          <User className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">No contacts found</h3>
        <p className="text-muted-foreground text-sm mb-4">Try adjusting your filters or search.</p>
        <Button onClick={onAdd} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="w-[50px] pl-6">
                <Checkbox
                  checked={isIndeterminate ? "indeterminate" : allSelected}
                  onCheckedChange={onToggleAll}
                  aria-label="Select all"
                  className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </TableHead>
              <TableHeadSortable label="Name" field="name" />
              <TableHeadSortable label="Title" field="title" />
              <TableHeadSortable label="Company" field="company" />
              <TableHeadSortable label="Status" field="status" />
              <TableHeadSortable label="Follow Up" field="follow_up_date" />
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => {
              const isSelected = selectedIds.includes(contact.id);
              const overdue = isOverdue(contact.follow_up_date);
              const dueToday = isDueToday(contact.follow_up_date);

              return (
                <TableRow
                  key={contact.id}
                  className={`group cursor-pointer border-border/40 hover:bg-muted/30 transition-colors ${isSelected ? 'bg-muted/40' : ''}`}
                  onClick={() => onRowClick(contact)}
                  data-state={isSelected ? "selected" : undefined}
                >
                  <TableCell onClick={(e) => e.stopPropagation()} className="pl-6">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelect(contact.id)}
                      aria-label="Select row"
                      className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {contact.name}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="truncate text-muted-foreground" title={contact.title}>{contact.title}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{contact.company}</TableCell>
                  <TableCell>
                    <StatusBadge status={contact.status} />
                  </TableCell>
                  <TableCell>
                    {contact.follow_up_date ? (
                      <span
                        className={`text-sm ${overdue
                          ? 'text-destructive font-medium'
                          : dueToday
                            ? 'text-warning-text font-medium'
                            : 'text-muted-foreground'
                          }`}
                      >
                        {formatDate(contact.follow_up_date)}
                        {overdue && ' (Overdue)'}
                        {dueToday && ' (Today)'}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); onEdit(contact); }}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); onDelete(contact); }}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {contacts.map((contact) => {
          const overdue = isOverdue(contact.follow_up_date);
          const dueToday = isDueToday(contact.follow_up_date);

          return (
            <div
              key={contact.id}
              className="bg-card p-4 rounded-lg shadow-sm border border-border active:bg-muted"
              onClick={() => onRowClick(contact)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{contact.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {contact.title} <span className="text-border">@</span> {contact.company}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(contact);
                  }}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between mt-4">
                <StatusBadge status={contact.status} />
                {contact.follow_up_date && (
                  <span className={`text-xs ${overdue ? 'text-destructive font-bold' : dueToday ? 'text-yellow-600 font-bold' : 'text-muted-foreground'}`}>
                    {overdue ? 'Overdue: ' : dueToday ? 'Due: ' : 'Follow-up: '}
                    {formatDate(contact.follow_up_date)}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  );
};

export default DataTable;
