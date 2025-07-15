import React, { useState, useEffect } from 'react';
import {
  fetchHistory,
  createHistoryEntry,
  deleteHistoryEntry,
  updateHistoryEntry,
} from '../api/historyApi';
import './HistoryPage.css';

const HistoryPage = () => {
  const [historyList, setHistoryList] = useState([]);
  const [summary, setSummary] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ summary: '', start: '', end: '' });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await fetchHistory();
    setHistoryList(data);
  };

  const handleAdd = async () => {
    if (!summary || !start || !end) return;
    const newEntry = { summary, startDateTime: start, endDateTime: end };
    await createHistoryEntry(newEntry); // ✅ fixed
    setSummary('');
    setStart('');
    setEnd('');
    loadHistory();
  };

  const handleDelete = async (id) => {
    await deleteHistoryEntry(id); // ✅ fixed
    loadHistory();
  };

  const handleEditClick = (entry) => {
    setEditingId(entry.id);
    setEditData({
      summary: entry.summary,
      start: entry.startDateTime.slice(0, 16),
      end: entry.endDateTime.slice(0, 16),
    });
  };

  const handleEditSave = async () => {
    await updateHistoryEntry(editingId, { // ✅ fixed
      summary: editData.summary,
      startDateTime: editData.start,
      endDateTime: editData.end,
    });
    setEditingId(null);
    loadHistory();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="history-page">
      <h2>📜 Your History</h2>
      <div className="history-form">
        <input
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
        <button onClick={handleAdd}>➕ Add</button>
      </div>

      <div className="history-list">
        {historyList.map((entry) => (
          <div key={entry.id} className="history-card">
            {editingId === entry.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editData.summary}
                  onChange={(e) => setEditData({ ...editData, summary: e.target.value })}
                />
                <input
                  type="datetime-local"
                  value={editData.start}
                  onChange={(e) => setEditData({ ...editData, start: e.target.value })}
                />
                <input
                  type="datetime-local"
                  value={editData.end}
                  onChange={(e) => setEditData({ ...editData, end: e.target.value })}
                />
                <button onClick={handleEditSave}>💾 Save</button>
                <button onClick={handleCancelEdit}>❌ Cancel</button>
              </div>
            ) : (
              <>
                <p><strong>{entry.summary}</strong></p>
                <p>{new Date(entry.startDateTime).toLocaleString()} → {new Date(entry.endDateTime).toLocaleString()}</p>
                <div className="history-actions">
                  <button onClick={() => handleEditClick(entry)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(entry.id)}>🗑️ Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
