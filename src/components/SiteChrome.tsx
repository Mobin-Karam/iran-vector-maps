import { PackageOpen } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './site-chrome.css'
import { GitHubMark, LinkedInMark } from './SocialIcons'

const links = [
  { to: '/', label: 'خانه' },
  { to: '/map', label: 'نقشه' },
  { to: '/about', label: 'راهنما' },
  { to: '/package', label: 'بسته' },
]

export function SiteChrome({ children, className = '', showFooter = true }: { children: ReactNode; className?: string; showFooter?: boolean }) {
  const location = useLocation()
  return <div className={`site-shell ${className}`} dir="rtl">
    <header className="site-header">
      <Link className="site-brand" to="/" aria-label="صفحهٔ اصلی Iran Vector Maps"><span className="site-brand-mark" aria-hidden="true" /><span>Iran Vector Maps</span></Link>
      <nav className="site-links" aria-label="ناوبری اصلی">{links.map((link) => <Link key={link.to} className={location.pathname === link.to ? 'is-current' : undefined} to={link.to}>{link.label}</Link>)}</nav>
      <div className="site-socials" dir="ltr" aria-label="پیوندهای پروژه">
        <a href="https://github.com/Mobin-Karam/iran-vector-maps" target="_blank" rel="noreferrer" aria-label="GitHub repository" title="GitHub repository"><GitHubMark width={18} height={18} /></a>
        <a href="https://www.linkedin.com/in/mobin-karam/" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><LinkedInMark width={18} height={18} /></a>
        <a href="https://www.npmjs.com/package/iran-vector-maps" target="_blank" rel="noreferrer" aria-label="npm package" title="npm package"><PackageOpen size={18} /></a>
      </div>
    </header>
    {children}
    {showFooter && <footer className="site-footer"><span>مرزهای اداری و نقاط شهر با منبع و وضعیت اعتبارسنجی مشخص می‌شوند.</span><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap</a></footer>}
  </div>
}
