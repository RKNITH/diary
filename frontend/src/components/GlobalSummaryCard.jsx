import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchSummary } from '../store/slices/summarySlice';

const fmt = (n) => new Intl.NumberFormat('en-IN').format(n || 0);

function StatBlock({ label, value, colorClass, borderClass, bgClass, percent }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`flex flex-col gap-1 p-4 rounded-2xl border ${bgClass} ${borderClass}`}
    >
      <span className={`text-[10px] uppercase tracking-widest font-bold ${colorClass} opacity-60`}>{label}</span>
      <span className={`font-mono font-extrabold text-lg sm:text-xl ${colorClass}`}>₹{fmt(value)}</span>
      {percent !== undefined && (
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex-1 h-1 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${colorClass.replace('text-', 'bg-')}`}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
          <span className={`text-[10px] font-mono ${colorClass} opacity-70`}>{percent.toFixed(1)}%</span>
        </div>
      )}
    </motion.div>
  );
}

export default function GlobalSummaryCard() {
  const dispatch = useDispatch();
  const { global: g, loading } = useSelector((s) => s.summary);

  useEffect(() => {
    dispatch(fetchSummary());
  }, [dispatch]);

  if (loading && !g) {
    return (
      <div className="glass-card p-6 animate-pulse">
        <div className="h-6 w-48 rounded-lg bg-slate-800 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl shimmer-bg" />
          ))}
        </div>
      </div>
    );
  }

  if (!g) return null;

  const grand = g.grandTotal || 0;
  const doneP = grand > 0 ? (g.totalDone / grand) * 100 : 0;
  const dueP = grand > 0 ? (g.totalDue / grand) * 100 : 0;
  const pendingP = grand > 0 ? (g.totalPending / grand) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-5 sm:p-6 glow-emerald"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-slate-100">Global Summary</h2>
            <p className="text-xs text-slate-500">{g.totalDiaries} {g.totalDiaries === 1 ? 'diary' : 'diaries'} · {g.totalEntries} entries</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Grand Total</span>
          <span className="font-mono font-extrabold text-2xl text-gradient-amber">₹{fmt(grand)}</span>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden flex mb-5">
        <motion.div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400" initial={{ width: 0 }} animate={{ width: `${doneP}%` }} transition={{ duration: 1, delay: 0.1 }} />
        <motion.div className="h-full bg-gradient-to-r from-amber-600 to-amber-400" initial={{ width: 0 }} animate={{ width: `${dueP}%` }} transition={{ duration: 1, delay: 0.2 }} />
        <motion.div className="h-full bg-gradient-to-r from-rose-600 to-rose-400" initial={{ width: 0 }} animate={{ width: `${pendingP}%` }} transition={{ duration: 1, delay: 0.3 }} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBlock label="Done" value={g.totalDone} colorClass="text-emerald-400" bgClass="bg-emerald-500/5" borderClass="border-emerald-500/15" percent={doneP} />
        <StatBlock label="Due" value={g.totalDue} colorClass="text-amber-400" bgClass="bg-amber-500/5" borderClass="border-amber-500/15" percent={dueP} />
        <StatBlock label="Pending" value={g.totalPending} colorClass="text-rose-400" bgClass="bg-rose-500/5" borderClass="border-rose-500/15" percent={pendingP} />
        <StatBlock label="Grand Total" value={grand} colorClass="text-slate-200" bgClass="bg-slate-500/5" borderClass="border-slate-500/20" />
      </div>
    </motion.div>
  );
}
