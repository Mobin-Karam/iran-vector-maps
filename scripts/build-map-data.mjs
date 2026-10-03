import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { topology } from 'topojson-server';

const root = new URL('..', import.meta.url).pathname;
const sources = join(root, 'data-source');
const output = join(root, 'public', 'maps', 'iran');
const normalize = (value = '') => value.replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[\u200c\u200e\u200f\ufeff]/g, ' ').replace(/\s+/g, ' ').trim();
const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
const writeJson = async (path, value) => writeFile(path, `${JSON.stringify(value)}\n`);
const countyName = (name) => normalize(name).replace(/^شهرستان\s+/, '');
const englishFallbacks = new Map([['گنبکی', 'Gunbaki'], ['جازموریان', 'Jazmurian'], ['مروست', 'Marvast']]);
const slugify = (value) => String(value ?? '').toLowerCase().replace(/\bcounty\b/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const signedArea = (ring) => ring.slice(0, -1).reduce((total, point, index) => { const next = ring[index + 1]; return total + point[0] * next[1] - next[0] * point[1] }, 0);
const rewind = (geometry) => {
  const rings = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.type === 'MultiPolygon' ? geometry.coordinates : [];
  for (const polygon of rings) polygon.forEach((ring, index) => { const wantsCounterClockwise = index === 0; if ((signedArea(ring) > 0) !== wantsCounterClockwise) ring.reverse() });
  return geometry;
};

// City point assets are generated and verified separately. Rebuilding boundary
// topology must not remove them, otherwise city markers disappear from the app.
await mkdir(output, { recursive: true });
await rm(join(output, 'regions'), { recursive: true, force: true });
await Promise.all(['manifest.json', 'provinces.topo.json', 'regions.json', 'search-index.json'].map((file) => rm(join(output, file), { force: true })));
await mkdir(join(output, 'regions'), { recursive: true });

const [boundarySource, provinceSource, countySource, countyGeometrySource, countyReadme, officialProvinces, officialCounties, officialDistricts, officialCities] = await Promise.all([
  readJson(join(sources, 'osm-provinces', 'ir_states_boundaries_coordinates.geojson')),
  readJson(join(sources, 'admin-metadata', 'data', 'all-province.json')),
  readJson(join(sources, 'admin-metadata', 'data', 'all-county.json')),
  readJson(join(sources, 'osm-counties', 'data', 'provinces', 'provinces.min.geojson')),
  readFile(join(sources, 'osm-counties', 'README.md'), 'utf8'),
  readJson(join(sources, 'official-divisions', 'dist', 'json', 'provinces.json')),
  readJson(join(sources, 'official-divisions', 'dist', 'json', 'counties.json')),
  readJson(join(sources, 'official-divisions', 'dist', 'json', 'districts.json')),
  readJson(join(sources, 'official-divisions', 'dist', 'json', 'cities-filtered.json')),
]);
const provinceMetadata = provinceSource.data ?? provinceSource;
const countyMetadata = countySource.data ?? countySource;
const provinceByName = new Map(provinceMetadata.map((item) => [normalize(item.name.local), item]));
const folderByProvinceName = new Map([...countyReadme.matchAll(/^\|\s*(IR-\d{2})\s*\|\s*([^|]+)/gm)].map((match) => [normalize(match[2]), match[1]]));
folderByProvinceName.set(normalize('کهگیلویه و بویر احمد'), 'IR-17');
folderByProvinceName.set(normalize('کهگیلویه و بویراحمد'), 'IR-17');
const officialProvinceByName = new Map(officialProvinces.map((region) => [normalize(region.name), region]));
const count = (items, key, value) => items.filter((item) => item[key] === value).length;
const regions = [{ id: 'IR', code: 'IR', slug: 'iran', nameFa: 'ایران', nameEn: 'Iran', level: 'country', parentId: null, source: 'OpenStreetMap / Open Admin Data', children: { provinces: 31 } }];
const provinceIndex = new Map();

for (const feature of countyGeometrySource.features) {
  const properties = feature.properties ?? {};
  const nameFa = normalize(properties['name:fa']);
  const code = folderByProvinceName.get(nameFa);
  if (!code || !nameFa) continue;
  const meta = provinceByName.get(nameFa);
  const official = officialProvinceByName.get(nameFa);
  const region = {
    id: code,
    code,
    slug: slugify(properties['name:en'] ?? meta?.name?.en),
    nameFa,
    nameEn: properties['name:en'] ?? meta?.name?.en,
    level: 'province',
    parentId: 'IR',
    center: meta?.geo ? { latitude: Number(meta.geo.lat), longitude: Number(meta.geo.lon) } : undefined,
    source: 'OpenStreetMap (Mapzen extract), matched with Open Admin Data metadata',
    sourceId: String(feature.id),
    geometryFile: 'provinces.topo.json',
    children: official ? { counties: count(officialCounties, 'province_id', official.id), districts: count(officialDistricts, 'province_id', official.id), cities: count(officialCities, 'province_id', official.id) } : meta?.children_count?.county ? { counties: meta.children_count.county } : undefined,
    childNames: official ? { counties: officialCounties.filter((item) => item.province_id === official.id).map((item) => item.name).sort((a, b) => a.localeCompare(b, 'fa')).slice(0, 8) } : undefined,
  };
  regions.push(region);
  provinceIndex.set(code, region);
}

for (const province of [...provinceIndex.values()]) {
  const path = join(sources, 'osm-counties', 'data', 'counties', province.id, `${province.id}.all.min.geojson`);
  try {
    const collection = await readJson(path);
    const features = collection.features
      .filter((feature) => feature.geometry?.type === 'Polygon' || feature.geometry?.type === 'MultiPolygon')
      .map((feature, index) => {
        const tags = feature.properties?.tags ?? {};
        const nameFa = countyName(tags.name ?? '');
        const meta = countyMetadata.find((item) => item.parent?.name?.local && normalize(item.parent.name.local) === province.nameFa && countyName(item.name.local) === nameFa);
        const officialProvince = officialProvinceByName.get(province.nameFa);
        const official = officialCounties.find((item) => item.province_id === officialProvince?.id && normalize(item.name) === nameFa);
        const id = official ? String(official.id) : meta?.id ?? `${province.id}-county-${feature.properties?.id ?? index + 1}`;
        const nameEn = tags['name:en'] ?? englishFallbacks.get(nameFa);
        const slug = slugify(nameEn) || `county-${slugify(nameFa) || index + 1}`;
        return { ...feature, id, geometry: rewind(structuredClone(feature.geometry)), properties: { id, code: id, slug, nameFa, nameEn, level: 'county', parentId: province.id, sourceId: String(feature.properties?.id ?? '') } };
      });
    const topologyData = topology({ counties: { type: 'FeatureCollection', features } });
    await mkdir(join(output, 'regions', province.id), { recursive: true });
    await writeJson(join(output, 'regions', province.id, 'counties.topo.json'), topologyData);
    for (const feature of features) {
      const officialProvince = officialProvinceByName.get(province.nameFa);
      const official = officialCounties.find((item) => item.province_id === officialProvince?.id && normalize(item.name) === feature.properties.nameFa);
      regions.push({ id: feature.id, code: feature.id, slug: feature.properties.slug, nameFa: feature.properties.nameFa, nameEn: feature.properties.nameEn, level: 'county', parentId: province.id, source: 'OpenStreetMap geometry + رسمی تقسیمات کشوری metadata', sourceId: feature.properties.sourceId, geometryFile: `regions/${province.id}/counties.topo.json`, children: official ? { districts: count(officialDistricts, 'county_id', official.id), cities: count(officialCities, 'county_id', official.id) } : undefined, childNames: official ? { districts: officialDistricts.filter((item) => item.county_id === official.id).map((item) => item.name).sort((a, b) => a.localeCompare(b, 'fa')).slice(0, 8), cities: officialCities.filter((item) => item.county_id === official.id).map((item) => item.name).sort((a, b) => a.localeCompare(b, 'fa')).slice(0, 8) } : undefined });
    }
  } catch {
    // A missing county asset is represented in the manifest rather than fabricated.
  }
}

const provinceFeatures = countyGeometrySource.features.map((feature) => {
  const code = folderByProvinceName.get(normalize(feature.properties?.['name:fa']));
  const region = provinceIndex.get(code);
  return { ...feature, id: code, geometry: rewind(structuredClone(feature.geometry)), properties: { id: code, code, slug: region?.slug, nameFa: region?.nameFa ?? normalize(feature.properties?.name), nameEn: region?.nameEn, level: 'province', parentId: 'IR' } };
});
await writeJson(join(output, 'provinces.topo.json'), topology({ provinces: { type: 'FeatureCollection', features: provinceFeatures } }));
await writeJson(join(output, 'regions.json'), regions);
await writeJson(join(output, 'search-index.json'), regions.map(({ id, nameFa, nameEn, level, parentId, code, slug }) => ({ id, nameFa, nameEn, level, parentId, code, slug })));
await writeJson(join(output, 'manifest.json'), { version: 1, datasetVersion: '2026-10-01', generatedAt: new Date().toISOString(), country: { id: 'IR', nameFa: 'ایران', nameEn: 'Iran' }, levels: ['province', 'county', 'district', 'city', 'rural-district', 'settlement'], availableGeometry: { provinces: true, counties: [...provinceIndex.keys()] }, unavailable: ['district', 'city', 'rural-district', 'settlement'] });
console.log(`Built ${provinceFeatures.length} province geometries and ${regions.filter((region) => region.level === 'county').length} county geometries.`);
