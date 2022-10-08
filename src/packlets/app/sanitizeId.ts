export const sanitizeId = (id: string) => {
  return String(id).replace(/[^0-9]/g, '')
}
