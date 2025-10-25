import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import ProductGrid from './components/ProductGrid'
import CartPanel from './components/CartPanel'
import AuthModal from './components/AuthModal'
import Checkout from './components/Checkout'

const initialProducts = [
  {
    id: 'cake-1',
    name: 'Chocolate Fudge Cake',
    description: 'Rich cocoa sponge layered with velvety fudge frosting.',
    price: 3200,
    image:
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop',
    tags: ['best seller', 'chocolate'],
  },
  {
    id: 'cake-2',
    name: 'Strawberry Shortcake',
    description: 'Vanilla sponge, whipped cream, and fresh strawberries.',
    price: 2900,
    image:
      'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1200&auto=format&fit=crop',
    tags: ['seasonal', 'fruit'],
  },
  {
    id: 'cake-3',
    name: 'Red Velvet',
    description: 'Moist red velvet layers with classic cream cheese frosting.',
    price: 3400,
    image:
      'https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=1200&auto=format&fit=crop',
    tags: ['classic'],
  },
  {
    id: 'cake-4',
    name: 'Lemon Drizzle Loaf',
    description: 'Bright lemon crumb and sweet citrus glaze.',
    price: 2100,
    image:
      'https://images.unsplash.com/photo-1605807646983-377bc5a76493?q=80&w=1200&auto=format&fit=crop',
    tags: ['light', 'citrus'],
  },
]

function useLocalStorage(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : defaultValue
    } catch (e) {
      return defaultValue
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch (e) {}
  }, [key, state])
  return [state, setState]
}

export default function App() {
  const [products] = useState(initialProducts)
  const [cart, setCart] = useLocalStorage('cart', [])
  const [user, setUser] = useLocalStorage('auth_user', null)
  const [token, setToken] = useLocalStorage('auth_token', null)
  const [showCart, setShowCart] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [isCheckout, setIsCheckout] = useState(false)
  const [search, setSearch] = useState('')

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    )
  }, [products, search])

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, qty }]
    })
    setShowCart(true)
  }

  const increment = (id) => setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)))
  const decrement = (id) =>
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))
        .filter((i) => i.qty > 0)
    )
  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id))
  const clearCart = () => setCart([])

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  const login = async ({ email, password }) => {
    // Simulated auth
    if (!email || !password) throw new Error('Email and password required')
    const fakeToken = btoa(`${email}:${Date.now()}`)
    setUser({ email })
    setToken(fakeToken)
    setShowAuth(false)
  }

  const register = async ({ name, email, password }) => {
    if (!name || !email || !password) throw new Error('All fields required')
    const fakeToken = btoa(`${email}:${Date.now()}`)
    setUser({ name, email })
    setToken(fakeToken)
    setShowAuth(false)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setShowCart(false)
    setIsCheckout(false)
  }

  const beginCheckout = () => {
    if (!user) {
      setShowAuth(true)
      return
    }
    setIsCheckout(true)
    setShowCart(false)
  }

  const completePayment = async ({ nameOnCard, cardNumber, exp, cvc, address, city, zip }) => {
    // Simulate payment processing delay
    await new Promise((res) => setTimeout(res, 800))
    // Clear cart after success
    clearCart()
    return {
      orderId: 'ord_' + Math.random().toString(36).slice(2),
      amount: cartTotal,
      email: user?.email,
      shipping: { address, city, zip },
      billedTo: nameOnCard,
      last4: (cardNumber || '').slice(-4),
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-pink-50 text-neutral-900">
      <Header
        onSearch={setSearch}
        cartCount={cartCount}
        onCartOpen={() => setShowCart(true)}
        onAuthOpen={() => setShowAuth(true)}
        user={user}
        onLogout={logout}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {!isCheckout && (
          <>
            <section className="mb-8">
              <div className="rounded-2xl bg-gradient-to-r from-rose-100 to-pink-100 p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between overflow-hidden">
                <div className="max-w-xl">
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-rose-900">Sweet Cravings, Baked Fresh Daily</h1>
                  <p className="mt-3 text-rose-800">Discover artisanal cakes made with premium ingredients. Order now and make every moment a celebration.</p>
                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => {
                        const el = document.getElementById('products')
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition"
                    >
                      Shop Cakes
                    </button>
                    <button
                      onClick={() => setShowAuth(true)}
                      className="px-4 py-2 rounded-lg bg-white/80 text-rose-700 hover:bg-white transition border border-rose-200"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
                <div className="mt-8 sm:mt-0">
                  <img
                    src="https://images.unsplash.com/photo-1713046976030-22b4b0f0e3c4?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxDYWtlJTIwaGVyb3xlbnwwfDB8fHwxNzYxMzc4NTA3fDA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80"
                    alt="Cake hero"
                    className="w-64 sm:w-80 rounded-xl shadow-xl"
                  />
                </div>
              </div>
            </section>

            <section id="products">
              <ProductGrid products={filteredProducts} onAdd={addToCart} />
            </section>
          </>
        )}

        {isCheckout && (
          <Checkout
            user={user}
            items={cart}
            total={cartTotal}
            onBack={() => setIsCheckout(false)}
            onPay={completePayment}
            onAfterPay={(receipt) => {
              setIsCheckout(false)
              setTimeout(() => {
                alert(
                  `Payment successful!\nOrder: ${receipt.orderId}\nAmount: $${(receipt.amount / 100).toFixed(2)}\nSent to: ${receipt.email}`
                )
              }, 0)
            }}
          />
        )}
      </main>

      <CartPanel
        open={showCart}
        onClose={() => setShowCart(false)}
        items={cart}
        onInc={increment}
        onDec={decrement}
        onRemove={removeFromCart}
        total={cartTotal}
        onCheckout={beginCheckout}
        onClear={clearCart}
      />

      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onLogin={login}
        onRegister={register}
      />
    </div>
  )
}
