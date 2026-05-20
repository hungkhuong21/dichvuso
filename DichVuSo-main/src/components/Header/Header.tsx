'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@clerk/clerk-react'
import logoQNU from '~/assets/logo/logoQNU.png'
import LoginModal from '../Auth/LoginModal'

type UserInfo = {
  id: number
  name?: string
  email?: string
  role?: string
}

export default function Header() {
  const { signOut } = useAuth()
  const [openLogin, setOpenLogin] = useState(false)
  const [user, setUser] = useState<UserInfo | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const loadUser = useCallback(() => {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem('dvs_user')
    if (raw) {
      try {
        setUser(JSON.parse(raw) as UserInfo)
      } catch {
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  useEffect(() => {
    window.addEventListener('dvs_auth_change', loadUser)
    window.addEventListener('storage', loadUser)
    return () => {
      window.removeEventListener('dvs_auth_change', loadUser)
      window.removeEventListener('storage', loadUser)
    }
  }, [loadUser])

  useEffect(() => {
    if (!showUserMenu) return
    function handleClickOutside(e: MouseEvent) {
      const menu = document.getElementById('user-menu-dropdown')
      if (menu && !menu.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showUserMenu])

  async function handleSignOut() {
    if (typeof window === 'undefined') return
    try {
      await signOut()
    } catch {
 
    }
    window.localStorage.removeItem('dvs_user')
    window.localStorage.removeItem('dvs_access_token')
    document.cookie = 'dvs_access_token=; path=/; max-age=0'
    document.cookie = 'dvs_user=; path=/; max-age=0'
    setUser(null)
    setShowUserMenu(false)
    window.dispatchEvent(new CustomEvent('dvs_auth_change'))
  }

  function handleLoginSuccess() {
    loadUser()
    setOpenLogin(false)

    // Nếu là admin → redirect sang app admin production
    const raw = window.localStorage.getItem('dvs_user')
    if (raw) {
      try {
        const u = JSON.parse(raw) as UserInfo
        if (u.role === 'admin') {
          window.location.href = 'https://dichvuso-3a3c.vercel.app/admin'
        }
      } catch {
      }
    }
  }

  const displayName = user?.name || user?.email || 'Người dùng'
  const isAdmin = user?.role === 'admin'

  return (
    <>
      <header className="bg-red-800 shadow-md">
        <div className="container mx-auto h-16 flex items-center justify-between px-4">

          {/* Logo + Tên trường */}
          <a href="/" className="flex items-center gap-3 group">
            <img
              src={logoQNU}
              className="w-11 h-11 transition-transform group-hover:scale-105"
              alt="Logo QNU"
            />
            <div className="text-white text-xs font-semibold hidden md:block leading-tight">
              <p className="uppercase tracking-wide">Trường Đại Học Quy Nhơn</p>
              <p className="uppercase tracking-widest text-white/70">Quy Nhon University</p>
            </div>
          </a>

          {/* Tiêu đề trung tâm */}
          <h1 className="text-lg sm:text-xl text-white font-bold tracking-widest hidden sm:block select-none">
            DỊCH VỤ SỐ
          </h1>

          {/* Phần bên phải: Auth */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative" id="user-menu-dropdown">
                {/* Avatar button */}
                <button
                  onClick={() => setShowUserMenu(v => !v)}
                  className="flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2 transition-colors"
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                >
                  {/* Avatar chữ cái */}
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/20 text-white text-xs font-bold uppercase shrink-0">
                    {displayName.charAt(0)}
                  </span>
                  <span className="text-sm font-semibold text-white hidden sm:block max-w-[120px] truncate">
                    {displayName}
                  </span>
                  {isAdmin && (
                    <span className="hidden sm:inline-flex items-center rounded-full bg-yellow-400 px-1.5 py-0.5 text-[10px] font-bold text-yellow-900 leading-none">
                      ADMIN
                    </span>
                  )}
                  {/* Chevron */}
                  <svg
                    className={`w-3.5 h-3.5 text-white/70 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.name || 'Người dùng'}</p>
                      {isAdmin && (
                        <span className="inline-flex items-center mt-1 rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-800">
                          Quản trị viên
                        </span>
                      )}
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      {/* Link Admin — chỉ hiển thị nếu là admin */}
                      {isAdmin && (
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50 transition-colors font-medium"
                          onClick={() => {
                            setShowUserMenu(false)
                            window.location.href = 'https://dichvuso-3a3c.vercel.app/admin/dashboard'
                          }}
                        >
                          <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          </svg>
                          Trang quản trị
                        </button>
                      )}
                    </div>

                    {/* Đăng xuất */}
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/>
                        </svg>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setOpenLogin(true)}
                className="flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2 text-sm font-semibold text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
                </svg>
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </header>

      <LoginModal
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  )
}