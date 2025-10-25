import { useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle, CreditCard } from 'lucide-react'

const Money = ({ cents }) => <span>${(cents / 100).toFixed(2)}</span>

export default function Checkout({ user, items = [], total = 0, onBack, onPay, onAfterPay }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [shipping, setShipping] = useState({ address: '', city: '', zip: '' })
  const [billing, setBilling] = useState({ nameOnCard: '', cardNumber: '', exp: '', cvc: '' })

  const lineItems = useMemo(() => items.map((i) => ({ ...i, lineTotal: i.qty * i.price })), [items])

  const handlePay = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const receipt = await onPay?.({ ...shipping, ...billing })
      onAfterPay?.(receipt)
    } catch (err) {
      setError(err.message || 'Payment failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-rose-700 hover:underline mb-4">
          <ArrowLeft size={16} /> Back to shop
        </button>
        <h2 className="text-2xl font-bold text-rose-900 mb-4">Checkout</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="rounded-2xl border border-rose-100 bg-white p-5">
            <h3 className="font-semibold text-rose-900 mb-3">Shipping</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-rose-800/80 mb-1">Address</label>
                <input
                  value={shipping.address}
                  onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
                  className="w-full rounded-lg border border-rose-200 px-3 py-2 focus:ring-2 focus:ring-rose-400 outline-none"
                  placeholder="123 Cake St"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-rose-800/80 mb-1">City</label>
                  <input
                    value={shipping.city}
                    onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                    className="w-full rounded-lg border border-rose-200 px-3 py-2 focus:ring-2 focus:ring-rose-400 outline-none"
                    placeholder="Sweetville"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-rose-800/80 mb-1">ZIP</label>
                  <input
                    value={shipping.zip}
                    onChange={(e) => setShipping((s) => ({ ...s, zip: e.target.value }))}
                    className="w-full rounded-lg border border-rose-200 px-3 py-2 focus:ring-2 focus:ring-rose-400 outline-none"
                    placeholder="12345"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-rose-100 bg-white p-5">
            <h3 className="font-semibold text-rose-900 mb-3">Payment</h3>
            <form onSubmit={handlePay} className="space-y-3">
              <div>
                <label className="block text-sm text-rose-800/80 mb-1">Name on card</label>
                <input
                  value={billing.nameOnCard}
                  onChange={(e) => setBilling((s) => ({ ...s, nameOnCard: e.target.value }))}
                  className="w-full rounded-lg border border-rose-200 px-3 py-2 focus:ring-2 focus:ring-rose-400 outline-none"
                  placeholder={user?.name || 'Jane Doe'}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-rose-800/80 mb-1">Card number</label>
                <input
                  inputMode="numeric"
                  pattern="[0-9 ]*"
                  value={billing.cardNumber}
                  onChange={(e) => setBilling((s) => ({ ...s, cardNumber: e.target.value }))}
                  className="w-full rounded-lg border border-rose-200 px-3 py-2 focus:ring-2 focus:ring-rose-400 outline-none"
                  placeholder="4242 4242 4242 4242"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-rose-800/80 mb-1">Expiry</label>
                  <input
                    value={billing.exp}
                    onChange={(e) => setBilling((s) => ({ ...s, exp: e.target.value }))}
                    className="w-full rounded-lg border border-rose-200 px-3 py-2 focus:ring-2 focus:ring-rose-400 outline-none"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-rose-800/80 mb-1">CVC</label>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={billing.cvc}
                    onChange={(e) => setBilling((s) => ({ ...s, cvc: e.target.value }))}
                    className="w-full rounded-lg border border-rose-200 px-3 py-2 focus:ring-2 focus:ring-rose-400 outline-none"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-sm text-rose-700 bg-rose-50 border border-rose-100 px-3 py-2 rounded-lg">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 text-white py-2.5 font-medium hover:bg-rose-700 disabled:opacity-50"
              >
                <CreditCard size={18} /> {submitting ? 'Processing...' : 'Pay now'}
              </button>
              <p className="text-xs text-rose-800/70 text-center">All payments are securely processed. This demo simulates payment for development.</p>
            </form>
          </section>
        </div>
      </div>

      <aside className="lg:col-span-1">
        <div className="rounded-2xl border border-rose-100 bg-white p-5 sticky top-20">
          <h3 className="font-semibold text-rose-900 mb-3">Order Summary</h3>
          <ul className="divide-y divide-rose-100">
            {lineItems.map((i) => (
              <li key={i.id} className="py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-rose-900 truncate">{i.name}</p>
                  <p className="text-xs text-rose-800/70">Qty {i.qty}</p>
                </div>
                <div className="text-sm font-medium text-rose-900">
                  <Money cents={i.lineTotal} />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-rose-100 pt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-rose-800/80">Subtotal</span>
              <span className="font-medium text-rose-900">
                <Money cents={total} />
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-rose-800/80">Shipping</span>
              <span className="font-medium text-rose-900">Free</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold text-rose-900">
              <span>Total</span>
              <span>
                <Money cents={total} />
              </span>
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 text-emerald-700 text-sm bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
            <CheckCircle size={16} /> 100% satisfaction guarantee
          </div>
        </div>
      </aside>
    </div>
  )
}
