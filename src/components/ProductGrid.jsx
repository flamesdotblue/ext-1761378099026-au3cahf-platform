import { Plus, Star } from 'lucide-react'

const Money = ({ cents }) => <span>${(cents / 100).toFixed(2)}</span>

export default function ProductGrid({ products = [], onAdd }) {
  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-bold text-rose-900">Featured Cakes</h2>
        <div className="text-sm text-rose-700/80">{products.length} items</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <article
            key={p.id}
            className="group rounded-2xl border border-rose-100 bg-white shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
          >
            <div className="relative">
              <img src={p.image} alt={p.name} className="h-48 w-full object-cover" />
              <div className="absolute top-3 left-3 flex gap-2">
                {p.tags?.slice(0, 2).map((t) => (
                  <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/90 border border-rose-100 text-rose-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-rose-900 group-hover:text-rose-700">{p.name}</h3>
              <p className="text-sm text-rose-900/80 mt-1 line-clamp-2">{p.description}</p>
              <div className="mt-auto flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-rose-900">
                    <Money cents={p.price} />
                  </span>
                  <span className="text-amber-500 inline-flex items-center text-xs">
                    <Star size={14} className="fill-amber-400 text-amber-400 mr-1" /> 4.8
                  </span>
                </div>
                <button
                  onClick={() => onAdd?.(p, 1)}
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-white hover:bg-rose-700"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
