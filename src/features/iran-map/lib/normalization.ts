export const normalizePersian = (value: string) => value
  .replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').replace(/[\u200c\u200f\ufeff]/g, ' ')
  .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
  .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
  .replace(/\s+/g, ' ').trim().toLocaleLowerCase('fa')
