export function serializeMapSvg(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  return new XMLSerializer().serializeToString(clone)
}

export function downloadMapSvg(svg: SVGSVGElement, filename = 'iran-admin-map.svg') {
  const url = URL.createObjectURL(new Blob([serializeMapSvg(svg)], { type: 'image/svg+xml;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
