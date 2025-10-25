import { ShoppingCart, User, LogOut, CakeSlice } from 'lucide-react'

export default function Header({ onSearch, cartCount, onCartOpen, onAuthOpen, user, onLogout }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-rose-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-rose-600 grid place-items-center text-white">
            <CakeSlice size={18} />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-rose-900">Velvet Crumbs</span>
        </div>
        <div className="hidden sm:block flex-1 px-6">
          <div className="max-w-xl">
            <input
              type="text"
              placeholder="Search cakes, flavors, tags..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full rounded-lg border border-rose-200 bg-white/60 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden sm:block text-sm text-rose-900/80 mr-2">{user.name ? user.name : user.email}</span>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-rose-700 hover:bg-rose-50"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={onAuthOpen}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-rose-700 hover:bg-rose-50"
            >
              <User size={18} />
              <span className="hidden sm:inline">Sign in</span>
            </button>
          )}

          <button
            onClick={onCartOpen}
            className="relative inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-white hover:bg-rose-700"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-white text-rose-700 text-xs font-bold h-5 min-w-[20px] px-1 shadow">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
