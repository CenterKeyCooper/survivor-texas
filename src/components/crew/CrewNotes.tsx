import { useState, useEffect } from 'react';
import { CrewNote } from '@/types/data';
import styles from './CrewNotes.module.css';

interface CrewNotesProps {
  crewId: string;
}

export default function CrewNotes({ crewId }: CrewNotesProps) {
  const [notes, setNotes] = useState<CrewNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    author: '',
    password: '',
  });

  useEffect(() => {
    loadNotes();
  }, [crewId]);

  async function loadNotes() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/crew/notes?crewId=${encodeURIComponent(crewId)}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || errorData.details || `Failed to load notes (${response.status})`);
      }

      const data = await response.json();
      setNotes(data.notes || []);
      setError(null);
    } catch (err) {
      console.error('Error loading notes:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load notes. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.content.trim() || !formData.author.trim() || !formData.password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch('/api/crew/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crewId,
          content: formData.content.trim(),
          author: formData.author.trim(),
          password: formData.password.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create note');
      }

      const data = await response.json();
      // Reload notes to ensure we only show notes with password 'joyce'
      // (filtered server-side)
      setFormData({ content: '', author: '', password: '' });
      setShowForm(false); // Hide form after successful submission
      await loadNotes(); // Reload to get filtered list
    } catch (err) {
      console.error('Error creating note:', err);
      setError(err instanceof Error ? err.message : 'Failed to create note. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(dateString: string) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  }

  return (
    <div className={styles.notesSection}>
      <div className={styles.notesHeader}>
        <h2>Notes</h2>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className={styles.leaveNoteButton}
          >
            Leave a Note
          </button>
        )}
      </div>
      
      {error && <div className={styles.errorMessage}>{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.noteForm}>
          <div className={styles.formGroup}>
            <label htmlFor="content">Your Note</label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write a note about this crew member..."
              rows={4}
              disabled={submitting}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="author">Your Name</label>
            <input
              type="text"
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Enter your name"
              disabled={submitting}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
              disabled={submitting}
              required
            />
            <p className={styles.passwordHint}>Only notes with the correct password will be displayed.</p>
          </div>
          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Note'}
            </button>
            <button 
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData({ content: '', author: '', password: '' });
                setError(null);
              }}
              className={styles.cancelButton}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className={styles.notesList}>
        {loading ? (
          <div className={styles.loading}>Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className={styles.noNotes}>No notes yet. Be the first to leave one!</div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className={styles.noteCard}>
              <div className={styles.noteHeader}>
                <span className={styles.noteAuthor}>{note.author}</span>
                <span className={styles.noteDate}>{formatDate(note.createdAt)}</span>
              </div>
              <div className={styles.noteContent}>{note.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

