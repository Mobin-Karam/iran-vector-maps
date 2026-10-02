import { Links, Meta, Outlet, Scripts } from '@remix-run/react'

export default function App() {
  return <html lang="fa" dir="rtl"><head><Meta /><Links /></head><body><Outlet /><Scripts /></body></html>
}
