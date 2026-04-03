import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchEntries, bulkUpdateEntries, clearEntries } from '../store/slices/entrySlice';
import { fetchDiaryById } from '../store/slices/diarySlice';
import { fetchSummary } from '../store/slices/summarySlice';
import EntryRow from '../components/EntryRow';
import SummaryFooter from '../components/SummaryFooter';
import EditDiaryModal from '../components/EditDiaryModal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const fmt = (n) => new Intl.NumberFormat('en-IN').format(n || 0);

export default function DiaryPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { list: entries, totals, diary, loading, saving, error } = useSelector((s) => s.entries);
  const { current: diaryDetails } = useSelector((s) => s.diaries);
  const [editOpen, setEditOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchEntries(id));
    dispatch(fetchDiaryById(id));
    return () => dispatch(clearEntries());
  }, [id, dispatch]);

  // Track changes
  useEffect(() => {
    if (isAuthenticated) setHasChanges(true);
  }, [entries]);

  const handleSave = async () => {
    try {
      await dispatch(bulkUpdateEntries({ diaryId: id, entries })).unwrap();
      await dispatch(fetchSummary());
      toast.success('All changes saved!');
      setHasChanges(false);
    } catch (err) {
      toast.error(err || 'Save failed');
    }
  };

  const filteredEntries = entries.filter((e) => {
    if (filter === 'done') return e.doneAmount > 0;
    if (filter === 'due') return e.dueAmount > 0;
    if (filter === 'pending') return e.pendingAmount > 0;
    if (filter === 'filled') return e.heading || e.doneAmount > 0 || e.dueAmount > 0 || e.pendingAmount > 0;
    return true;
  });

  const currentDiary = diary || diaryDetails;

  if (loading) return (
    <div className="page-container">
      <LoadingSpinner size="lg" text="Loading diary entries..." />
    </div>
  );

  if (error) return (
    <div className="page-container">
      <div className="glass-card p-8 text-center">
        <p className="text-rose-400 mb-4">{error}</p>
        <button onClick={() => navigate('/')} className="btn-secondary">Back to Home</button>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => navigate('/')}
                className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back
              </button>
              <span className="text-slate-700">/</span>
              <span className="text-xs text-slate-500 font-mono">Diary #{currentDiary?.diaryNumber}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
              {currentDiary?.title || 'Loading...'}
            </h1>
            {currentDiary?.description && (
              <p className="text-sm text-slate-500 mt-1">{currentDiary.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <span className="font-mono text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                Serials {currentDiary?.startSerial}–{currentDiary?.endSerial}
              </span>
              <span className="text-xs text-slate-600">{entries.length} entries</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => setEditOpen(true)}
                  className="btn-secondary text-sm flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                  </svg>
                  Edit Info
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary text-sm flex items-center gap-1.5"
                >
                  {saving ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                      </svg>
                      Save All
                    </>
                  )}
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Summary footer at top */}
      <SummaryFooter totals={totals} />

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 mt-6 mb-4 flex-wrap">
        {[
          { key: 'all', label: 'All Rows', count: entries.length },
          { key: 'filled', label: 'Filled', count: entries.filter(e => e.heading || e.doneAmount > 0 || e.dueAmount > 0 || e.pendingAmount > 0).length },
          { key: 'done', label: 'Done', count: entries.filter(e => e.doneAmount > 0).length },
          { key: 'due', label: 'Due', count: entries.filter(e => e.dueAmount > 0).length },
          { key: 'pending', label: 'Pending', count: entries.filter(e => e.pendingAmount > 0).length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filter === tab.key
                ? tab.key === 'done' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : tab.key === 'due' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : tab.key === 'pending' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-white/10 text-slate-200 border border-white/20'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            {tab.label}
            <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded-md">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass-card overflow-hidden"
      >
        {isAuthenticated && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/5 border-b border-amber-500/15">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-medium text-amber-400/80">Admin Mode — Editing enabled. Click Save All to persist changes.</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/50">
                <th className="px-3 py-3 text-center text-[10px] uppercase tracking-widest font-bold text-slate-500 w-12">S.No</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-widest font-bold text-slate-500">Heading</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-widest font-bold text-emerald-500/70 text-center">Done ₹</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-widest font-bold text-amber-500/70 text-center">Due ₹</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-widest font-bold text-rose-500/70 text-center">Pending ₹</th>
                <th className="px-3 py-3 text-[10px] uppercase tracking-widest font-bold text-slate-500 text-right">Row Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry, i) => {
                const originalIndex = entries.findIndex((e) => e._id === entry._id);
                return (
                  <EntryRow
                    key={entry._id}
                    entry={entry}
                    index={originalIndex}
                    isAdmin={isAuthenticated}
                  />
                );
              })}
            </tbody>
            {/* Table totals row */}
            <tfoot>
              <tr className="border-t-2 border-emerald-500/20 bg-slate-900/60">
                <td className="px-3 py-3 text-center">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Total</span>
                </td>
                <td className="px-3 py-3 text-xs font-semibold text-slate-400">
                  {filteredEntries.length} {filter !== 'all' ? 'filtered' : ''} rows shown
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="font-mono font-bold text-emerald-400 text-sm">₹{fmt(totals.totalDone)}</span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="font-mono font-bold text-amber-400 text-sm">₹{fmt(totals.totalDue)}</span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="font-mono font-bold text-rose-400 text-sm">₹{fmt(totals.totalPending)}</span>
                </td>
                <td className="px-3 py-3 text-right">
                  <span className="font-mono font-extrabold text-slate-100 text-sm">₹{fmt(totals.grandTotal)}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>

      {/* Floating save bar on mobile */}
      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 sm:hidden"
        >
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2 shadow-2xl shadow-emerald-500/30 px-6"
          >
            {saving ? 'Saving...' : '💾 Save All Changes'}
          </button>
        </motion.div>
      )}

      <EditDiaryModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        diary={currentDiary}
      />
    </div>
  );
}
