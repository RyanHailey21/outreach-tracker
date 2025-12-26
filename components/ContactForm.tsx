import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Contact, Status, Industry, ConnectionType } from '../types';
import { STATUS_CONFIG, INDUSTRY_OPTIONS, CONNECTION_TYPE_OPTIONS } from '../constants';
import { generateId } from '../utils';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ContactFormProps {
  initialData?: Contact;
  onSave: (contact: Contact) => void;
  onCancel: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Contact>>({
    name: '',
    title: '',
    company: '',
    linkedin_url: '',
    status: Status.ToContact,
    response_received: false,
    call_scheduled: false,
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (formData.name && formData.name.length > 100) newErrors.name = 'Name is too long';

    if (!formData.title?.trim()) newErrors.title = 'Job title is required';

    if (!formData.company?.trim()) newErrors.company = 'Company is required';

    if (!formData.linkedin_url?.trim()) {
      newErrors.linkedin_url = 'LinkedIn URL is required';
    } else if (!formData.linkedin_url.includes('linkedin.com/')) {
      // Very basic validation, could be regex
      newErrors.linkedin_url = 'Must be a valid LinkedIn URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate slight delay for effect
    setTimeout(() => {
      const now = Date.now();
      const contact: Contact = {
        id: initialData?.id || generateId(),
        created_at: initialData?.created_at || now,
        updated_at: now,
        name: formData.name!,
        title: formData.title!,
        company: formData.company!,
        linkedin_url: formData.linkedin_url!,
        status: formData.status as Status,
        industry: formData.industry,
        connection_type: formData.connection_type,
        date_messaged: formData.date_messaged,
        follow_up_date: formData.follow_up_date,
        notes: formData.notes,
        response_received: !!formData.response_received,
        call_scheduled: !!formData.call_scheduled,
        call_date: formData.call_date,
      };

      onSave(contact);
      setIsSubmitting(false);
    }, 400);
  };

  const handleChange = (field: keyof Contact, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl overflow-hidden shadow-xl max-h-[90vh] border border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background z-10">
        <h2 className="text-xl font-semibold text-foreground">
          {initialData ? 'Edit Contact' : 'Add Contact'}
        </h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Body */}
      <form id="contact-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              placeholder="Senior Sales Engineer"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              placeholder="Acme Corp"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              className={errors.company ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn URL *</Label>
            <Input
              id="linkedin"
              placeholder="https://linkedin.com/in/..."
              value={formData.linkedin_url}
              onChange={(e) => handleChange('linkedin_url', e.target.value)}
              className={errors.linkedin_url ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.linkedin_url && <p className="text-xs text-destructive">{errors.linkedin_url}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select
              value={formData.industry || "placeholder"}
              onValueChange={(val) => handleChange('industry', val === "placeholder" ? "" : val)}
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder" disabled>Select...</SelectItem>
                {INDUSTRY_OPTIONS.map((ind) => (
                  <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="connection">Connection Type</Label>
            <Select
              value={formData.connection_type || "placeholder"}
              onValueChange={(val) => handleChange('connection_type', val === "placeholder" ? "" : val)}
            >
              <SelectTrigger id="connection">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder" disabled>Select...</SelectItem>
                {CONNECTION_TYPE_OPTIONS.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(val) => handleChange('status', val)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_messaged">Date Messaged</Label>
            <Input
              id="date_messaged"
              type="date"
              value={formData.date_messaged ? new Date(formData.date_messaged).toISOString().split('T')[0] : ''}
              onChange={(e) => handleChange('date_messaged', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="follow_up_date">Follow-Up Date</Label>
          <Input
            id="follow_up_date"
            type="date"
            value={formData.follow_up_date ? new Date(formData.follow_up_date).toISOString().split('T')[0] : ''}
            onChange={(e) => handleChange('follow_up_date', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
          />
          <p className="text-xs text-muted-foreground">Set a date to receive a reminder.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Met at career fair..."
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      </form>

      {/* Footer */}
      <div className="flex items-center justify-end px-6 py-4 border-t border-border bg-muted/50 gap-3">
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" form="contact-form" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Save Changes' : 'Save Contact'}
        </Button>
      </div>
    </div>
  );
};

export default ContactForm;
