'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'email') setEmail(value)
    if (name === 'password') setPassword(value)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.')
      return
    }

    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dichvuso.onrender.com'

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Đăng nhập thất bại. Kiểm tra lại email hoặc mật khẩu.')
      }

      const data = await response.json()

      if (data.accessToken) {
        document.cookie = `admin_token=${data.accessToken}; path=/; max-age=86400`
        localStorage.setItem('admin_user', JSON.stringify(data.user || {}))
        router.push('/admin/dashboard')
      } else {
        setError('Token không hợp lệ.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Syne:wght@600;700&display=swap');

        .login-root {
          min-height: 100vh;
          background: #0a0f1e;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .login-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .login-bg-orb-1 {
          width: 400px; height: 400px;
          background: rgba(24, 95, 165, 0.18);
          top: -100px; left: -100px;
        }

        .login-bg-orb-2 {
          width: 300px; height: 300px;
          background: rgba(29, 158, 117, 0.12);
          bottom: -80px; right: -60px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.04);
          border: 0.5px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2.5rem 2.25rem 2rem;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .card-accent {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #185FA5, #1D9E75, #185FA5, transparent);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }

        @keyframes shimmer {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }

        .login-icon-wrap {
          width: 48px; height: 48px;
          background: rgba(24, 95, 165, 0.15);
          border: 0.5px solid rgba(24, 95, 165, 0.3);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.25rem;
        }

        .login-icon-wrap svg {
          width: 22px; height: 22px;
          stroke: #4a9de0;
          fill: none;
          stroke-width: 1.75;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .login-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #f0f4ff;
          margin: 0 0 4px;
        }

        .login-sub {
          font-size: 13px;
          color: rgba(200, 210, 240, 0.5);
          margin: 0 0 2rem;
        }

        .field-group {
          margin-bottom: 1rem;
        }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          color: rgba(200, 210, 240, 0.5);
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .field-wrap {
          position: relative;
        }

        .field-icon {
          position: absolute;
          left: 12px; top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          width: 16px; height: 16px;
          stroke: rgba(200, 210, 240, 0.35);
          fill: none;
          stroke-width: 1.75;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .field-input {
          width: 100%;
          padding: 10px 12px 10px 38px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          background: rgba(255, 255, 255, 0.05);
          border: 0.5px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #e8eeff;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .field-input::placeholder {
          color: rgba(200, 210, 240, 0.25);
        }

        .field-input:focus {
          border-color: rgba(24, 95, 165, 0.6);
          box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.12);
          background: rgba(24, 95, 165, 0.06);
        }

        .eye-btn {
          position: absolute;
          right: 10px; top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: rgba(200, 210, 240, 0.35);
          display: flex; align-items: center; justify-content: center;
          transition: color 0.15s;
        }

        .eye-btn:hover { color: rgba(200, 210, 240, 0.7); }

        .eye-btn svg {
          width: 16px; height: 16px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.75;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .error-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(220, 50, 50, 0.1);
          border: 0.5px solid rgba(220, 50, 50, 0.3);
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13px;
          color: #f87171;
          margin-bottom: 1rem;
        }

        .error-box svg {
          width: 16px; height: 16px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.75;
          stroke-linecap: round;
          stroke-linejoin: round;
          flex-shrink: 0;
        }

        .submit-btn {
          width: 100%;
          padding: 11px;
          background: #185FA5;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s, opacity 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 1.25rem;
          letter-spacing: 0.01em;
        }

        .submit-btn:hover:not(:disabled) { background: #0C447C; }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .submit-btn svg {
          width: 16px; height: 16px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.75;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .spinner-icon {
          animation: spin 0.7s linear infinite;
        }

        .footer-note {
          text-align: center;
          font-size: 12px;
          color: rgba(200, 210, 240, 0.25);
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .footer-note svg {
          width: 12px; height: 12px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.75;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      `}</style>

      <div className="login-root">
        <div className="login-bg-orb login-bg-orb-1" />
        <div className="login-bg-orb login-bg-orb-2" />

        <div className="login-card">
          <div className="card-accent" />

          {/* Icon */}
          <div className="login-icon-wrap">
            <svg viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          <h1 className="login-title">Quản Trị Viên</h1>
          <p className="login-sub">Dịch Vụ Số — Khu vực dành riêng</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div className="field-group">
              <label htmlFor="email" className="field-label">Email</label>
              <div className="field-wrap">
                <svg className="field-icon" viewBox="0 0 24 24">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                  className="field-input"
                  placeholder="admin@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="field-group">
              <label htmlFor="password" className="field-label">Mật khẩu</label>
              <div className="field-wrap">
                <svg className="field-icon" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                  className="field-input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="error-box">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <>
                  <svg className="spinner-icon" viewBox="0 0 24 24">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng nhập
                  <svg viewBox="0 0 24 24">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="footer-note">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Chỉ dành cho quản trị viên
          </p>
        </div>
      </div>
    </>
  )
}