import { X, Minus, Plus, Trash2, CreditCard } from 'lucide-react'

const Money = ({ cents }) => <span>${(cents / 100).toFixed(2)}</span>

export default function CartPanel({ open, onClose, items = [], onInc, onDec, onRemove, total, onCheckout, onClear }) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl border-l border-rose-100 transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-16 px-4 border-b border-rose-100 flex items-center justify-between">
          <h3 className="font-semibold text-rose-900">Your Cart</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-rose-50">
            <X size={18} />
          </button>
        </div>

        <div className="h-[calc(100%-8rem)] overflow-y-auto p-4 space-y-3">
          {items.length === 0 && (
            <p className="text-sm text-rose-800/70">Your cart is empty. Add some sweet treats!</p>
          )}
          {items.map((i) => (
            <div key={i.id} className="flex gap-3 border border-rose-100 rounded-xl p-3">
              <img src={i.image} alt={i.name} className="h-16 w-16 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-rose-900 truncate">{i.name}</p>
                    <p className="text-sm text-rose-700/80">
                      <Money cents={i.price} />
                    </p>
                  </div>
                  <button onClick={() => onRemove?.(i.id)} className="p-2 rounded-lg hover:bg-rose-50 text-rose-700">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-lg border border-rose-200">
                    <button onClick={() => onDec?.(i.id)} className="p-2 hover:bg-rose-50">
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-sm">{i.qty}</span>
                    <button onClick={() => onInc?.(i.id)} className="p-2 hover:bg-rose-50">
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-sm font-medium text-rose-900">
                    <Money cents={i.qty * i.price} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-16 px-4 border-t border-rose-100 flex items-center justify-between bg-white">
          <div>
            <span className="text-sm text-rose-700/80 mr-2">Total:</span>
            <span className="font-bold text-rose-900">
              <Money cents={total || 0} />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              disabled={items.length === 0}
              className="px-3 py-2 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 disabled:opacity-50"
            >
              Clear
            </button>
            <button
              onClick={onCheckout}
              disabled={items.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-white hover:bg-rose-700 disabled:opacity-50"
            >
              <CreditCard size={16} /> Checkout
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
