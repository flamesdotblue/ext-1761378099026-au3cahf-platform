import { useState } from 'react'
import { X } from 'lucide-react'

export default function AuthModal({ open, onClose, onLogin, onRegister }) {
  const [mode, setMode] = useState('login')
  const [error, setError] = useState('')

  const switchMode = () => {
    setError('')
    setMode((m) => (m === 'login' ? 'register' : 'login'))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const form = new FormData(e.currentTarget)
    try {
      if (mode === 'login') {
        await onLogin?.({ email: form.get('email'), password: form.get('password') })
      } else {
        await onRegister?.({ name: form.get('name'), email: form.get('email'), password: form.get('password') })
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    }
  }

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`absolute left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl border border-rose-100 transition-transform ${
          open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="px-6 py-4 border-b border-rose-100 flex items-center justify-between">
          <h3 className="font-semibold text-rose-900">{mode === 'login' ? 'Sign in' : 'Create account'}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-rose-50">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm text-rose-800/80 mb-1">Name</label>
              <input name="name" type="text" required className="w-full rounded-lg border border-rose-200 px-3 py-2 focus:ring-2 focus:ring-rose-400 outline-none" />
            </div>
          )}
          <div>
            <label className="block text-sm text-rose-800/80 mb-1">Email</label>
            <input name="email" type="email" required className="w-full rounded-lg border border-rose-200 px-3 py-2 focus:ring-2 focus:ring-rose-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-rose-800/80 mb-1">Password</label>
            <input name="password" type="password" minLength={6} required className="w-full rounded-lg border border-rose-200 px-3 py-2 focus:ring-2 focus:ring-rose-400 outline-none" />
          </div>
          {error && <p className="text-sm text-rose-700 bg-rose-50 border border-rose-100 px-3 py-2 rounded-lg">{error}</p>}
          <button type="submit" className="w-full rounded-lg bg-rose-600 text-white py-2.5 font-medium hover:bg-rose-700">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
          <p className="text-sm text-center text-rose-800/80">
            {mode === 'login' ? (
              <>
                New here?{' '}
                <button type="button" onClick={switchMode} className="text-rose-700 font-medium hover:underline">
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" onClick={switchMode} className="text-rose-700 font-medium hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  )
}
