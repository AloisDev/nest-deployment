import { Pagination } from 'nestjs-typeorm-paginate';

export function checkPaginatorLinks(paginatedResult: any): Pagination<any> {
  if (
    paginatedResult &&
    paginatedResult.meta &&
    paginatedResult.meta.totalPages < paginatedResult.meta.currentPage
  )
    paginatedResult.links.previous = paginatedResult.links.last;
  return paginatedResult;
}

export function removePaginatorFields(queryDto: any) {
  delete queryDto.page;
  delete queryDto.limit;
}

export function modifyPaginatorLinks(paginatedResult: any): Pagination<any> {
  if (
    paginatedResult &&
    paginatedResult.meta &&
    paginatedResult.meta.totalPages < paginatedResult.meta.currentPage
  )
    paginatedResult.links.previous = paginatedResult.links.last;
  return paginatedResult;
}
