import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBooks } from '../../api/books.api.js';
import { createTicket } from '../../api/tickets.api.js';
import { validateTicketInput } from './ticketValidation.js';
import SubmitQueryForm from './SubmitQueryForm.jsx';
import Toast from '../../components/ui/Toast.jsx';

/**
 * SubmitQueryPage composes SubmitQueryForm, handles submission lifecycle, toast, and redirects.
 */
export function SubmitQueryPage() {
  const [books, setBooks] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getMyBooks().then(setBooks).catch(() => setBooks([]));
  }, []);

  const handleClearFieldError = (field) => {
    setFieldErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const handleSubmit = async (payload) => {
    const clientErrors = validateTicketInput(payload);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    setFieldErrors({});
    try {
      const ticket = await createTicket(payload);
      const ticketNum = ticket?.ticketNumber || ticket?._id;
      setToastMessage(`Ticket #${ticketNum} created successfully! Redirecting...`);
      setTimeout(() => navigate('/tickets'), 1500);
    } catch (err) {
      if (err.details && Array.isArray(err.details)) {
        const serverErrors = {};
        err.details.forEach((d) => {
          const key = d.path.replace('body.', '');
          serverErrors[key] = d.message;
        });
        setFieldErrors(serverErrors);
      } else {
        setFieldErrors({ general: err.message || 'Failed to submit query.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-charcoal tracking-tight">
          Submit Support Query
        </h1>
        <p className="text-sm text-charcoal-light mt-1">
          Have an inquiry regarding royalties, ISBNs, printing, or distribution? Our team will assist you.
        </p>
      </div>

      <SubmitQueryForm
        books={books}
        submitting={submitting}
        fieldErrors={fieldErrors}
        onClearFieldError={handleClearFieldError}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/books')}
      />

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}

export default SubmitQueryPage;
