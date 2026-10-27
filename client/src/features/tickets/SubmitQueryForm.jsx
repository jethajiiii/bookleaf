import { useState } from 'react';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Button from '../../components/ui/Button.jsx';
import AttachmentDropzone from './AttachmentDropzone.jsx';

/**
 * Form component for author query submission with validation and dropzone.
 */
export function SubmitQueryForm({
  books = [],
  submitting = false,
  fieldErrors = {},
  onClearFieldError,
  onSubmit,
  onCancel,
}) {
  const [bookId, setBookId] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);

  const bookOptions = [
    { label: 'General / Account Level', value: '' },
    ...books.map((b) => ({
      label: `${b.title} (${b.isbn || b.bookCode})`,
      value: b._id,
    })),
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      subject: subject.trim(),
      description: description.trim(),
      bookId: bookId || null,
      attachments,
    });
  };

  return (
    <Card>
      {fieldErrors.general && (
        <div className="mb-4 p-3 rounded-xl bg-terracotta-light border border-terracotta/30 text-terracotta text-xs font-medium">
          {fieldErrors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Select
          label="Related Book"
          options={bookOptions}
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          helperText="Select a book or leave as General / Account Level for broad account queries"
        />

        <Input
          label="Subject"
          required
          maxLength={150}
          placeholder="e.g. Delayed royalty payout for Q3"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            if (fieldErrors.subject && onClearFieldError) onClearFieldError('subject');
          }}
          error={fieldErrors.subject}
          helperText="Concise summary (5 - 150 characters)"
        />

        <Textarea
          label="Description"
          required
          rows={5}
          maxLength={5000}
          placeholder="Provide relevant details so our team can investigate promptly..."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (fieldErrors.description && onClearFieldError) onClearFieldError('description');
          }}
          error={fieldErrors.description}
          helperText="Detailed explanation (minimum 20 characters)"
        />

        <AttachmentDropzone attachments={attachments} onChange={setAttachments} />

        <div className="pt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Query'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default SubmitQueryForm;
