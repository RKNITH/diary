import { motion } from 'framer-motion';

const fmt = (n) => new Intl.NumberFormat('en-IN').format(n || 0);

export default function SummaryFooter({ totals }) {
  const { totalDone = 0, totalDue = 0, totalPending = 0, grandTotal = 0 } = totals || {};

  const donePercent = grandTotal > 0 ? (totalDone / grandTotal) * 100 : 0;
  const duePercent = grandTotal > 0 ? (totalDue / grandTotal) * 100 : 0;
  const pendingPercent = grandTotal > 0 ? (totalPending / grandTotal) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-card p-4 sm:p-5 mt-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
        <span className="font-display font-bold text-base text-slate-200">Diary Summary</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex mb-4">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: `${donePercent}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
          initial={{ width: 0 }}
          animate={{ width: `${duePercent}%` }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        <motion.div
          className="h-full bg-gradient-to-r from-rose-500 to-rose-400"
          initial={{ width: 0 }}
          animate={{ width: `${pendingPercent}%` }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
          <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-500/60">Done</span>
          <span className="font-mono font-bold text-emerald-400 text-sm sm:text-base">₹{fmt(totalDone)}</span>
          <span className="text-[10px] text-emerald-600 font-mono">{donePercent.toFixed(1)}%</span>
        </div>
        <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-amber-500/8 border border-amber-500/15">
          <span className="text-[10px] uppercase tracking-widest font-bold text-amber-500/60">Due</span>
          <span className="font-mono font-bold text-amber-400 text-sm sm:text-base">₹{fmt(totalDue)}</span>
          <span className="text-[10px] text-amber-600 font-mono">{duePercent.toFixed(1)}%</span>
        </div>
        <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-rose-500/8 border border-rose-500/15">
          <span className="text-[10px] uppercase tracking-widest font-bold text-rose-500/60">Pending</span>
          <span className="font-mono font-bold text-rose-400 text-sm sm:text-base">₹{fmt(totalPending)}</span>
          <span className="text-[10px] text-rose-600 font-mono">{pendingPercent.toFixed(1)}%</span>
        </div>
        <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-slate-500/8 border border-slate-500/20">
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500/60">Grand Total</span>
          <span className="font-mono font-bold text-slate-200 text-sm sm:text-base">₹{fmt(grandTotal)}</span>
          <span className="text-[10px] text-slate-600 font-mono">100%</span>
        </div>
      </div>
    </motion.div>
  );
}
