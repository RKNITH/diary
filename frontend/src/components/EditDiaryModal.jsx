import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { updateDiary } from '../store/slices/diarySlice';
import toast from 'react-hot-toast';

export default function EditDiaryModal({ isOpen, onClose, diary }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (diary) setForm({ title: diary.title || '', description: diary.description || '' });
  }, [diary]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    setLoading(true);
    try {
      await dispatch(updateDiary({ id: diary._id, data: form })).unwrap();
      toast.success('Diary updated!');
      onClose();
    } catch (err) {
      toast.error(err || 'Failed to update diary');
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg text-slate-100">Edit Diary #{diary?.diaryNumber}</h2>
              <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" autoFocus />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
