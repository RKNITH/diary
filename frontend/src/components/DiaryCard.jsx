import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDiary } from '../store/slices/diarySlice';
import { fetchSummary } from '../store/slices/summarySlice';
import toast from 'react-hot-toast';

const fmt = (n) => new Intl.NumberFormat('en-IN').format(n || 0);

export default function DiaryCard({ diary, index }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const totals = diary.totals || {};

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteDiary(diary._id)).unwrap();
      await dispatch(fetchSummary());
      toast.success(`Diary #${diary.diaryNumber} deleted`);
    } catch (err) {
      toast.error(err || 'Delete failed');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const donePercent = totals.grandTotal > 0 ? (totals.totalDone / totals.grandTotal) * 100 : 0;
  const duePercent = totals.grandTotal > 0 ? (totals.totalDue / totals.grandTotal) * 100 : 0;
  const pendingPercent = totals.grandTotal > 0 ? (totals.totalPending / totals.grandTotal) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="glass-card p-5 flex flex-col gap-4 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
              #{diary.diaryNumber}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {diary.startSerial}–{diary.endSerial}
            </span>
          </div>
          <h3 className="font-display font-bold text-lg text-slate-100 truncate group-hover:text-emerald-300 transition-colors">
            {diary.title}
          </h3>
          {diary.description && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{diary.description}</p>
          )}
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              to={`/diary/${diary._id}`}
              className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
              title="Edit diary"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            </Link>
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
              title="Delete diary"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
        <div className="h-full bg-emerald-500 rounded-l-full transition-all duration-700" style={{ width: `${donePercent}%` }} />
        <div className="h-full bg-amber-500 transition-all duration-700" style={{ width: `${duePercent}%` }} />
        <div className="h-full bg-rose-500 rounded-r-full transition-all duration-700" style={{ width: `${pendingPercent}%` }} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
          <span className="text-[10px] uppercase tracking-wider text-emerald-500/70 font-semibold mb-0.5">Done</span>
          <span className="text-sm font-bold font-mono text-emerald-400">₹{fmt(totals.totalDone)}</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <span className="text-[10px] uppercase tracking-wider text-amber-500/70 font-semibold mb-0.5">Due</span>
          <span className="text-sm font-bold font-mono text-amber-400">₹{fmt(totals.totalDue)}</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-xl bg-rose-500/5 border border-rose-500/10">
          <span className="text-[10px] uppercase tracking-wider text-rose-500/70 font-semibold mb-0.5">Pending</span>
          <span className="text-sm font-bold font-mono text-rose-400">₹{fmt(totals.totalPending)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <div>
          <span className="text-xs text-slate-500">Total </span>
          <span className="text-sm font-bold font-mono text-slate-200">₹{fmt(totals.grandTotal)}</span>
        </div>
        <Link
          to={`/diary/${diary._id}`}
          className="text-xs font-medium text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors"
        >
          View Entries
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

      {/* Delete Confirm Modal */}
      {showConfirm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-slate-950/95 backdrop-blur-sm p-4"
        >
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-200 mb-1">Delete Diary #{diary.diaryNumber}?</p>
            <p className="text-xs text-slate-500 mb-4">This will delete all 50 entries. Cannot be undone.</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setShowConfirm(false)} className="btn-secondary text-xs px-4 py-2">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="btn-danger text-xs px-4 py-2">
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
