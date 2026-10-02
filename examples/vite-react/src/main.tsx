import { createRoot } from 'react-dom/client'
import { IranAdminSvgMap, type MapFeatureCollection } from 'iran-vector-maps'
import 'iran-vector-maps/styles.css'

const regions: MapFeatureCollection = { type: 'FeatureCollection', features: [{ type: 'Feature', properties: { id: 'north', nameFa: 'شمال', nameEn: 'North' }, geometry: { type: 'Polygon', coordinates: [[[0, 0], [5, 0], [4, 4], [0, 0]]] } }, { type: 'Feature', properties: { id: 'south', nameFa: 'جنوب', nameEn: 'South' }, geometry: { type: 'Polygon', coordinates: [[[0, -1], [4, -1], [4, -5], [0, -1]]] } }] }

createRoot(document.getElementById('root')!).render(<IranAdminSvgMap data={regions} values={{ north: 72, south: 38 }} colorScale={{ classification: 'threshold', breaks: [50], colors: ['#bfdbfe', '#1d4ed8'] }} onRegionClick={(region) => console.info(region.id)} />)
