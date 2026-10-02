import { useEffect } from 'react'

type SeoOptions = { title: string; description: string; path?: string; image?: string }

const siteName = 'Iran Vector Maps'
const origin = 'https://mobin-karam.github.io/iran-vector-maps'

function setMeta(selector: string, attribute: 'name' | 'property', key: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) { element = document.createElement('meta'); document.head.append(element) }
  element.setAttribute(attribute, key)
  element.content = value
}

export function usePageSeo({ title, description, path = '/', image = '/iran-vector-maps-cover.png' }: SeoOptions) {
  useEffect(() => {
    const fullTitle = `${title} | ${siteName}`
    const url = `${origin}${path}`
    document.title = fullTitle
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)
    setMeta('meta[property="og:image"]', 'property', 'og:image', `${origin}${image}`)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical) }
    canonical.href = url
  }, [description, image, path, title])
}
