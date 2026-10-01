import { Download } from 'lucide-react'
import './sample-download.css'

export function SampleDownload() { return <a className="sample-download" href={`${import.meta.env.BASE_URL}data-samples/iran-map-metrics.sample.json`} download><Download size={17} /> دریافت نمونه JSON</a> }
