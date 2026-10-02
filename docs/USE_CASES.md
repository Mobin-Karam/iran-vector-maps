# Use cases and data contracts

The renderer is appropriate when a product already owns its data and needs a fast, inspectable regional view. It is not a replacement for routing, GPS, address search, or a live basemap.

| Use case | Example metric | Suggested scale | Required provenance |
| --- | --- | --- | --- |
| Registered births | `registered-births-1404` | Quantile, five colors | Civil-registration release and observation date |
| School access | Schools per 10,000 residents | Threshold | Education source, population denominator, date |
| Health coverage | Travel-time service coverage | Custom thresholds | Methodology, facility list, calculation date |
| Sales territory | Revenue or active customers | Continuous | Internal reporting period and access controls |
| Election reporting | Votes or turnout | Threshold | Official election authority and update timestamp |
| Disaster response | Verified incidents | Custom thresholds | Incident source, time window, and data sensitivity policy |

## Minimal metric contract

```json
[{ "regionId": "IR-05", "labelFa": "تولد ثبت‌شده", "value": 12840, "unitFa": "نفر", "source": "منبع معتبر", "observedAt": "2026-03-20" }]
```

Use stable `regionId` values, not display names. Keep raw source, unit, observation date, and permissions in the host product. Validate unknown region IDs before applying a color scale.
