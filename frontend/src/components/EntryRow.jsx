import { useDispatch, useSelector } from 'react-redux';
import { updateLocalEntry } from '../store/slices/entrySlice';

const fmt = (n) => new Intl.NumberFormat('en-IN').format(n || 0);

export default function EntryRow({ entry, index, isAdmin }) {
  const dispatch = useDispatch();

  const handleChange = (field, value) => {
    const numVal = field !== 'heading' ? (parseFloat(value) || 0) : value;
    dispatch(updateLocalEntry({ index, field, value: numVal }));
  };

  const rowTotal = (Number(entry.doneAmount) || 0) + (Number(entry.dueAmount) || 0) + (Number(entry.pendingAmount) || 0);

  const getRowStyle = () => {
    if (entry.pendingAmount > 0) return 'border-rose-500/10 hover:bg-rose-500/3';
    if (entry.dueAmount > 0) return 'border-amber-500/10 hover:bg-amber-500/3';
    if (entry.doneAmount > 0) return 'border-emerald-500/10 hover:bg-emerald-500/3';
    return 'border-white/5 hover:bg-white/3';
  };

  return (
    <tr className={`border-b transition-colors duration-150 ${getRowStyle()} group`}>
      {/* Serial */}
      <td className="px-3 py-2 text-center">
        <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-slate-400 transition-colors">
          {entry.serialNumber}
        </span>
      </td>

      {/* Heading */}
      <td className="px-3 py-2">
        {isAdmin ? (
          <input
            type="text"
            value={entry.heading || ''}
            onChange={(e) => handleChange('heading', e.target.value)}
            placeholder="Enter heading..."
            className="amount-input text-left text-slate-200 placeholder-slate-600 text-sm w-full min-w-[140px]"
          />
        ) : (
          <span className="text-sm text-slate-300">{entry.heading || <span className="text-slate-600 italic text-xs">—</span>}</span>
        )}
      </td>

      {/* Done */}
      <td className="px-3 py-2">
        {isAdmin ? (
          <input
            type="number"
            value={entry.doneAmount || ''}
            onChange={(e) => handleChange('doneAmount', e.target.value)}
            placeholder="0"
            min="0"
            className="amount-input text-emerald-400 w-24"
          />
        ) : (
          <span className={`text-sm font-mono font-semibold ${entry.doneAmount > 0 ? 'text-emerald-400' : 'text-slate-600'}`}>
            {entry.doneAmount > 0 ? `₹${fmt(entry.doneAmount)}` : '—'}
          </span>
        )}
      </td>

      {/* Due */}
      <td className="px-3 py-2">
        {isAdmin ? (
          <input
            type="number"
            value={entry.dueAmount || ''}
            onChange={(e) => handleChange('dueAmount', e.target.value)}
            placeholder="0"
            min="0"
            className="amount-input text-amber-400 w-24"
          />
        ) : (
          <span className={`text-sm font-mono font-semibold ${entry.dueAmount > 0 ? 'text-amber-400' : 'text-slate-600'}`}>
            {entry.dueAmount > 0 ? `₹${fmt(entry.dueAmount)}` : '—'}
          </span>
        )}
      </td>

      {/* Pending */}
      <td className="px-3 py-2">
        {isAdmin ? (
          <input
            type="number"
            value={entry.pendingAmount || ''}
            onChange={(e) => handleChange('pendingAmount', e.target.value)}
            placeholder="0"
            min="0"
            className="amount-input text-rose-400 w-24"
          />
        ) : (
          <span className={`text-sm font-mono font-semibold ${entry.pendingAmount > 0 ? 'text-rose-400' : 'text-slate-600'}`}>
            {entry.pendingAmount > 0 ? `₹${fmt(entry.pendingAmount)}` : '—'}
          </span>
        )}
      </td>

      {/* Row Total */}
      <td className="px-3 py-2 text-right">
        <span className={`text-sm font-mono font-bold ${rowTotal > 0 ? 'text-slate-200' : 'text-slate-700'}`}>
          {rowTotal > 0 ? `₹${fmt(rowTotal)}` : '—'}
        </span>
      </td>
    </tr>
  );
}
