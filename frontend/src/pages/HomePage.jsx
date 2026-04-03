import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchDiaries } from '../store/slices/diarySlice';
import GlobalSummaryCard from '../components/GlobalSummaryCard';
import DiaryCard from '../components/DiaryCard';
import CreateDiaryModal from '../components/CreateDiaryModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HomePage() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.diaries);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchDiaries());
  }, [dispatch]);

  const filtered = list.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      String(d.diaryNumber).includes(search) ||
      String(d.startSerial).includes(search)
  );

  return (
    <div className="page-container">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-2">
              Diary Management System
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              <span className="text-gradient-emerald">Diary</span>
            </h1>
            <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-xl">
              Track every transaction across structured diaries — each with 50 entries, full amount breakdowns, and real-time summaries.
            </p>
          </div>

          {isAuthenticated && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowCreate(true)}
              className="btn-primary flex items-center gap-2 self-start sm:self-end whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Diary
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Global Summary */}
      <div className="mb-8">
        <GlobalSummaryCard />
      </div>

      {/* Diaries section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-bold text-xl text-slate-200">All Diaries</h2>
          <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-lg">
            {list.length}
          </span>
        </div>
        <div className="relative max-w-xs w-full">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search diaries..."
            className="input-field pl-9 py-2 text-sm"
          />
        </div>
      </div>

      {/* States */}
      {loading && list.length === 0 && (
        <LoadingSpinner text="Loading diaries..." />
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6 text-center border-rose-500/20"
        >
          <p className="text-rose-400 text-sm">{error}</p>
          <button onClick={() => dispatch(fetchDiaries())} className="btn-secondary text-sm mt-3">
            Retry
          </button>
        </motion.div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h3 className="font-display font-bold text-lg text-slate-400 mb-1">
            {search ? 'No diaries match your search' : 'No diaries yet'}
          </h3>
          <p className="text-sm text-slate-600">
            {isAuthenticated ? 'Create your first diary to get started.' : 'The admin hasn\'t created any diaries yet.'}
          </p>
          {isAuthenticated && !search && (
            <button onClick={() => setShowCreate(true)} className="btn-primary mt-4 text-sm">
              Create First Diary
            </button>
          )}
        </motion.div>
      )}

      {/* Diary Grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative">
          {filtered.map((diary, i) => (
            <div key={diary._id} className="relative">
              <DiaryCard diary={diary} index={i} />
            </div>
          ))}
        </div>
      )}

      <CreateDiaryModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
