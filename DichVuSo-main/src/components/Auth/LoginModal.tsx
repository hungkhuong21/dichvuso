import * as React from 'react'
import { SignInButton, useAuth, useUser } from "@clerk/clerk-react";

type Props = {
  open: boolean
  onClose: () => void
  onLoginSuccess?: () => void 
}

function makeCaptcha(len = 4) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)]
  return out
}

export default function LoginModal({ open, onClose, onLoginSuccess }: Props) {
  const [mode] = React.useState<'username' | 'email'>('username')
  const [login, setLogin] = React.useState('user@dichvuso.local')
  const [password, setPassword] = React.useState('')
  const [captcha, setCaptcha] = React.useState(() => makeCaptcha())
  const [captchaInput, setCaptchaInput] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const { user } = useUser()

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  React.useEffect(() => {
    if (!open) return
    setError(null)
    setCaptcha(makeCaptcha())
    setCaptchaInput('')
  }, [open])

  React.useEffect(() => {
    if (user) {
      const u = { id: Number(user.id), name: user.firstName, email: user.emailAddresses[0].emailAddress }
      window.localStorage.setItem('dvs_user', JSON.stringify(u))
      onClose()
      onLoginSuccess?.() 
    }
  }, [user, onClose, onLoginSuccess])

  if (!open) return null

  function refreshCaptcha() {
    setCaptcha(makeCaptcha())
    setCaptchaInput('')
  }

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    setError(null)

    if (captchaInput.trim().toUpperCase() !== captcha) {
      setError('Mã captcha không đúng.')
      refreshCaptcha()
      return
    }

    setLoading(true)

    try {
      const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3003').replace(/\/+$/, '')

      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: login, password })
      })

      if (!res.ok) {
        setError('Sai email hoặc mật khẩu.')
        return
      }

      const data = (await res.json()) as {
        access_token?: string
        user?: { id: number; name?: string; email?: string; role?: string }
      }

      const maxAge = 7 * 24 * 3600
      const cookieFlags = `path=/; max-age=${maxAge}; SameSite=Lax`

      if (data.access_token) {
        window.localStorage.setItem('dvs_access_token', data.access_token)
        document.cookie = `dvs_access_token=${data.access_token}; ${cookieFlags}`
      }
      if (data.user) {
        window.localStorage.setItem('dvs_user', JSON.stringify(data.user))
        document.cookie = `dvs_user=${encodeURIComponent(JSON.stringify(data.user))}; ${cookieFlags}`
      }

      if (data.user?.role === 'admin') {
        window.location.href = 'http://localhost:3100/admin/dashboard'
        return
      }

      onClose()
      onLoginSuccess?.()
    } catch {
      setError('Không thể kết nối máy chủ. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50'>
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />
      <div className='absolute inset-0 flex items-center justify-center px-4'>
        <div className='w-full max-w-xs rounded-xl bg-white p-4 shadow-xl'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <div className='text-base font-semibold text-red-800'>Đăng nhập</div>
              <div className='mt-1 text-xs text-gray-600'>
                Đăng nhập để lưu dịch vụ yêu thích.
              </div>
            </div>
            <button
              type='button'
              onClick={onClose}
              className='rounded-md px-2 py-1 text-gray-600 hover:bg-gray-100'
              aria-label='Close'
            >
              ✕
            </button>
          </div>

          <form className='mt-3 space-y-2.5' onSubmit={onSubmit}>
            {error && (
              <div className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700'>
                {error}
              </div>
            )}

            <label className='block'>
              <div className='text-xs font-medium text-gray-700'>
                {mode === 'email' ? 'Email' : 'Tên đăng nhập'}
              </div>
              <input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                type='text'
                className='mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-red-500'
                placeholder={mode === 'email' ? 'you@domain.com' : 'Tên đăng nhập'}
                required
              />
            </label>

            <label className='block'>
              <div className='text-xs font-medium text-gray-700'>Mật khẩu</div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type='password'
                className='mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-red-500'
                placeholder='••••••••'
                required
              />
            </label>

            <div className='flex items-center gap-2.5'>
              <div
                className='flex h-9 flex-1 items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-base font-bold tracking-widest text-gray-700'
                aria-label='Captcha'
              >
                {captcha}
              </div>
              <button
                type='button'
                onClick={refreshCaptcha}
                className='inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                aria-label='Refresh captcha'
                title='Đổi captcha'
              >
                ↻
              </button>
            </div>

            <label className='block'>
              <div className='text-xs font-medium text-gray-700'>Nhập mã captcha</div>
              <input
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                type='text'
                className='mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-red-500'
                placeholder='Nhập mã captcha'
                required
              />
            </label>

            <div className='flex items-center justify-between'>
              <button
                type='button'
                onClick={() => setError('Chức năng quên mật khẩu chưa được triển khai.')}
                className='text-sm text-gray-600 hover:underline'
              >
                Quên mật khẩu
              </button>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='inline-flex h-10 w-full items-center justify-center rounded-lg bg-red-800 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70'
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>

            <SignInButton mode="modal">
              <button
                type="button"
                className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-red-800 px-4 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Đăng nhập Email / Google
              </button>
            </SignInButton>
          </form>
        </div>
      </div>
    </div>
  )
}