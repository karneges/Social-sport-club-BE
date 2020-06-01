export interface Pagination {
  total: number,
  "next"?: {
    "page": number,
    "limit": number
  },
  "prev"?: {
    "page": number,
    "limit": number
  }
}
