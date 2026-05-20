import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import SearchInput from './components/Search/SearchInput'
import Collapse from './components/Collapse/Collapse'
import { removeDiacritics } from './helpers/stringUtils'
import clsx from 'clsx'

const BASE_URL = (import.meta.env.VITE_API_URL || 'https://dichvuso.onrender.com').replace(/\/+$/, '')

type ApiCategory = { id: number; name: string; slug: string }
type ApiService = {
  id: number; name: string; slug: string
  department: string; image: string | null; path: string
  isActive: number
  categories: { id: number; name: string; slug: string }[]
}

function getCurrentUserId() {
  try {
    const raw = window.localStorage.getItem('dvs_user')
    if (!raw) return null
    const user = JSON.parse(raw) as { id?: number }
    return typeof user.id === 'number' ? user.id : null
  } catch { return null }
}

function getFavoritesKey() {
  const userId = getCurrentUserId()
  return userId ? `dvs_favorites_${userId}` : 'dvs_favorites_anon'
}

function getUsageKey() {
  const userId = getCurrentUserId()
  return userId ? `dvs_usage_${userId}` : 'dvs_usage_anon'
}

function loadFavorites(): Set<number> {
  try {
    const raw = window.localStorage.getItem(getFavoritesKey())
    if (!raw) return new Set<number>()
    const ids = JSON.parse(raw) as number[]
    return Array.isArray(ids)
      ? new Set(ids.filter((x) => typeof x === 'number'))
      : new Set<number>()
  } catch {
    return new Set<number>()
  }
}

function loadUsage(): Record<number, number> {
  try {
    const raw = window.localStorage.getItem(getUsageKey())
    if (!raw) return {}
    const parsed = JSON.parse(raw) as { services?: Record<string, number> }
    const svcs = parsed?.services || {}
    const next: Record<number, number> = {}
    for (const [k, v] of Object.entries(svcs)) {
      const id = Number(k)
      if (Number.isFinite(id) && typeof v === 'number') next[id] = v
    }
    return next
  } catch {
    return {}
  }
}

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<number>(0)
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set())
  const [serviceUsage, setServiceUsage] = useState<Record<number, number>>({})

  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [services, setServices] = useState<ApiService[]>([])
  const [loadingCat, setLoadingCat] = useState(true)
  const [loadingSvc, setLoadingSvc] = useState(true)

  useEffect(() => {
    fetch(`${BASE_URL}/categories`)
      .then((r) => r.json())
      .then((data: ApiCategory[]) => setCategories(data))
      .catch(console.error)
      .finally(() => setLoadingCat(false))
  }, [])

  useEffect(() => {
    fetch(`${BASE_URL}/services?limit=100`)
      .then((r) => r.json())
      .then((data: { data: ApiService[] }) => setServices(data.data ?? []))
      .catch(console.error)
      .finally(() => setLoadingSvc(false))
  }, [])

  useEffect(() => {
    setFavoriteIds(loadFavorites())
    setServiceUsage(loadUsage())

    const handleAuthChange = () => {
      setFavoriteIds(loadFavorites())
      setServiceUsage(loadUsage())
    }

    window.addEventListener('dvs_auth_change', handleAuthChange)
    return () => window.removeEventListener('dvs_auth_change', handleAuthChange)
  }, [])

  function trackServiceUsage(serviceId: number) {
    const key = getUsageKey()
    const next = { ...serviceUsage, [serviceId]: (serviceUsage[serviceId] || 0) + 1 }
    setServiceUsage(next)
    const forStorage: Record<string, number> = {}
    for (const [k, v] of Object.entries(next)) forStorage[String(k)] = v
    window.localStorage.setItem(key, JSON.stringify({ services: forStorage }))
  }

  function openService(item: ApiService) {
    trackServiceUsage(item.id)
    fetch(`${BASE_URL}/services/${item.id}/visit`, { method: 'POST' }).catch(() => { })
    window.open(item.path, '_blank')
  }

  // Dịch vụ phổ biến
  const popularServices = useMemo(() => {
    const arr = Object.entries(serviceUsage)
      .map(([id, count]) => ({ id: Number(id), count }))
      .filter((x) => Number.isFinite(x.id) && x.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
      .map((x) => ({ service: services.find((s) => s.id === x.id), count: x.count }))
      .filter((x): x is { service: ApiService; count: number } => Boolean(x.service))
    return arr
  }, [serviceUsage, services])

  const suggestedPopularServices = useMemo(
    () => services.slice(0, 6).map((service) => ({ service, count: 0 })),
    [services]
  )
  const popularServicesToShow = popularServices.length ? popularServices : suggestedPopularServices
  const popularServicesTitle = popularServices.length ? 'Dịch vụ phổ biến' : 'Dịch vụ phổ biến (gợi ý)'

  function persistFavorites(next: Set<number>) {
    window.localStorage.setItem(getFavoritesKey(), JSON.stringify(Array.from(next)))
  }

  function toggleFavorite(serviceId: number) {
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (next.has(serviceId)) next.delete(serviceId)
      else next.add(serviceId)
      persistFavorites(next)
      return next
    })
  }

  // Lọc dịch vụ theo danh mục + search
  const filteredServices = useMemo(() => {
    let list = services
    if (selectedCategory !== 0) {
      list = list.filter((s) => s.categories.some((c) => c.id === selectedCategory))
    }
    if (search.trim()) {
      const q = removeDiacritics(search.toLowerCase())
      list = list.filter(
        (s) =>
          removeDiacritics(s.name.toLowerCase()).includes(q) ||
          removeDiacritics(s.department.toLowerCase()).includes(q)
      )
    }
    return list
  }, [services, selectedCategory, search])

  // Nhóm theo category
  const groups = useMemo(() => {
    if (selectedCategory !== 0) {
      const cat = categories.find((c) => c.id === selectedCategory)
      return [{ name: cat?.name ?? '', items: filteredServices }]
    }
    const groupMap = new Map<string, ApiService[]>()
    for (const s of filteredServices) {
      const groupName = s.categories[0]?.name ?? 'Khác'
      if (!groupMap.has(groupName)) groupMap.set(groupName, [])
      groupMap.get(groupName)!.push(s)
    }
    return Array.from(groupMap.entries()).map(([name, items]) => ({ name, items }))
  }, [filteredServices, selectedCategory, categories])

  const loading = loadingCat || loadingSvc

  function ServiceCard({ item }: { item: ApiService }) {
    const isFav = favoriteIds.has(item.id)
    const imageUrl = item.image?.startsWith('http') ? item.image : `${BASE_URL}${item.image}`
    return (
      <div onClick={() => openService(item)} className='cursor-pointer'>
        {/* Mobile */}
        <div className='relative col-span-1 block sm:hidden border border-red-800 rounded-lg p-3 transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gray-100'>
          <button
            type='button'
            onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id) }}
            className={clsx(
              'absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full border text-lg shadow-sm transition',
              isFav ? 'border-red-200 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
            )}
            aria-label={isFav ? 'Bỏ yêu thích' : 'Yêu thích'}
          >
            {isFav ? '♥' : '♡'}
          </button>
          <div className='flex flex-row items-center gap-2'>
            <div className='w-1/4 flex justify-center'>
              <img src={imageUrl} className='h-10' alt={item.name} />
            </div>
            <div className='flex flex-col w-3/4 items-center'>
              <span className='text-base font-semibold text-gray-700'>{item.name}</span>
              <span className='text-[12px] font-semibold text-gray-700 px-4 py-1 border rounded-full'>{item.department}</span>
            </div>
          </div>
        </div>
        {/* Desktop */}
        <div className='relative col-span-1 hidden sm:block border border-red-800 rounded-lg p-4 transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gray-100'>
          <button
            type='button'
            onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id) }}
            className={clsx(
              'absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full border text-lg shadow-sm transition',
              isFav ? 'border-red-200 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
            )}
            aria-label={isFav ? 'Bỏ yêu thích' : 'Yêu thích'}
          >
            {isFav ? '♥' : '♡'}
          </button>
          <div className='flex flex-col justify-center items-center text-center gap-4 h-40'>
            <img src={imageUrl} className='h-24' alt={item.name} />
            <div className='flex flex-col'>
              <span className='text-[16px] font-bold text-red-800'>{item.name}</span>
              <span className='text-[12px] font-semibold text-gray-600'>{item.department}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className='flex-grow'>
        <div className='container mx-auto py-4'>
          <section className='text-center'>
            <div className='flex justify-center items-center'>
              <SearchInput setSearch={setSearch} />
            </div>

            {/* Tabs danh mục */}
            <div className='mt-3 mx-3 flex flex-row flex-wrap items-center justify-center gap-2'>
              <button
                className={clsx(
                  'text-sm font-normal px-2.5 py-1 cursor-pointer rounded-full',
                  selectedCategory === 0 ? 'text-white bg-red-600' : 'text-[#7f7f7f] border border-[#cccccc]'
                )}
                onClick={() => setSelectedCategory(0)}
              >
                Tất cả
              </button>
              {categories.map((item) => (
                <button
                  key={item.id}
                  className={clsx(
                    'text-sm font-normal px-2.5 py-1 cursor-pointer rounded-full',
                    selectedCategory === item.id ? 'text-white bg-red-600' : 'text-[#7f7f7f] border border-[#cccccc]'
                  )}
                  onClick={() => setSelectedCategory(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Nút thu/phóng */}
            <button
              type='button'
              onClick={() => setIsOpen(!isOpen)}
              className='mt-3 inline-flex items-center gap-1 rounded-lg bg-red-800 px-3 py-1.5 text-sm font-semibold text-white'
            >
              {isOpen ? 'Thu gọn' : 'Mở rộng'}
              <svg xmlns='http://www.w3.org/2000/svg' height='16px' viewBox='0 -960 960 960' width='16px' fill='#FFFFFF'>
                <path d='M120-120v-240h80v104l124-124 56 56-124 124h104v80H120Zm516-460-56-56 124-124H600v-80h240v240h-80v-104L636-580Z' />
              </svg>
            </button>

            {loading && (
              <div className='mt-8 text-center text-gray-500'>Đang tải dữ liệu...</div>
            )}

            {/* Dịch vụ phổ biến — chỉ hiện khi chọn Tất cả */}
            {!loading && selectedCategory === 0 && (
              <Collapse key='popular-services' title={popularServicesTitle} isOpen={isOpen}>
                <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
                  {popularServicesToShow.map(({ service }) => (
                    <ServiceCard key={service.id} item={service} />
                  ))}
                </div>
              </Collapse>
            )}

            {/* Dịch vụ yêu thích — chỉ hiện khi chọn Tất cả và có ít nhất 1 dịch vụ được yêu thích */}
            {!loading && selectedCategory === 0 && favoriteIds.size > 0 && (
              <Collapse key='favorite-services' title={`Dịch vụ yêu thích (${favoriteIds.size})`} isOpen={isOpen}>
                <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
                  {services
                    .filter((s) => favoriteIds.has(s.id))
                    .map((item) => (
                      <ServiceCard key={item.id} item={item} />
                    ))}
                </div>
              </Collapse>
            )}

            {/* Nhóm dịch vụ */}
            {!loading && groups.map(({ name, items }) => {
              if (items.length === 0) return null
              return (
                <Collapse key={name} title={name} isOpen={isOpen}>
                  <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
                    {items.map((item) => (
                      <ServiceCard key={item.id} item={item} />
                    ))}
                  </div>
                </Collapse>
              )
            })}
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default App