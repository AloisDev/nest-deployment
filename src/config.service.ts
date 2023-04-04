require('dotenv').config()


export class ConfigService {
  static paginationConfig() {
    return {
      DEFAULT_PAGE: +(process.env.DEFAULT_PAGE || '1'),
      DEFAULT_PAGE_LIMIT: +(process.env.DEFAULT_PAGE_LIMIT || '10'),
      MIN_PAGE_LIMIT: +(process.env.MIN_PAGE_LIMIT || '10'),
      MAX_PAGE_LIMIT: +(process.env.MAX_PAGE_LIMIT || '100'),
    }
  }
}