export const emptyValue = (property: string) => `'${property}'이(가) 비어있습니다.`;
export const invalidValue = (property: string) => `'${property}'이(가) 올바르지 않습니다.`;
export const invalidMin = (property: string, min: number) => `'${property}'은(는) ${min}이상이어야 합니다.`;
export const invalidMax = (property: string, max: number) => `'${property}'은(는) ${max}이하여야 합니다.`;
