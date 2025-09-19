"use client";
import React, { useState, useEffect } from 'react';

const NotesApp = () => {
  const [note, setNote] = useState('');

  // Load note from localStorage on initial render
  useEffect(() => {
    try {
      const savedNote = localStorage.getItem('lnd-notes-app');
      if (savedNote) {
        setNote(savedNote);
      }
    } catch (error) {
        console.error("Could not load note from localStorage", error);
    }
  }, []);

  // Save note to localStorage whenever it changes
  useEffect(() => {
    try {
        localStorage.setItem('lnd-notes-app', note);
    } catch (error) {
        console.error("Could not save note to localStorage", error);
    }
  }, [note]);

  return (
    <div>
      <h3 className="results-title" style={{ marginBottom: '20px' }}>Simple Notes</h3>
      <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '20px' }}>
        Your notes are saved automatically to your browser&apos;s local storage.
      </p>
      <div className="form-group">
        <textarea
          id="noteInput"
          className="prompt-input"
          placeholder="Start typing your notes here..."
          style={{ minHeight: '400px', fontSize: '1rem', lineHeight: '1.6' }}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};

export default NotesApp;
