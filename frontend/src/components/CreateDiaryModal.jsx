import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { createDiary } from '../store/slices/diarySlice';
import { fetchSummary } from '../store/slices/summarySlice';
import toast from 'react-hot-toast';

export default function CreateDiaryModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.diaries);
  const [form, setForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);

  const nextNumber = (list.length > 0 ? Math.max(...list.map((d) => d.diaryNumber)) : 0) + 1;
  const startSerial = (nextNumber - 1) * 50 + 1;
  const endSerial = nextNumber * 50;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    setLoading(true);
    try {
      await dispatch(createDiary(form)).unwrap();
      await dispatch(fetchSummary());
      toast.success(`Diary #${nextNumber} created!`);
      setForm({ title: '', description: '' });
      onClose();
    } catch (err) {
      toast.error(err || 'Failed to create diary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-md glass-card p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-100">Create New Diary</h2>
                  <p className="text-xs text-slate-500">Auto-assigned Diary #{nextNumber}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Info banner */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 mb-5">
              <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <p className="text-xs text-amber-300/80">
                This diary will cover serial numbers <span className="font-mono font-bold text-amber-400">{startSerial}–{endSerial}</span> with 50 auto-generated rows.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Diary Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Q1 2025 Transactions"
                  className="input-field"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Description <span className="text-slate-600">(optional)</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={onClose} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating...
                    </span>
                  ) : 'Create Diary'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
