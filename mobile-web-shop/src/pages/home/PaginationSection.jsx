import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export function PaginationSection({ currentPage, setCurrentPage, productsPerPage, totalProducts }) {
  let pages = [];
  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pages.push(i);
  }
  const noOfPages = pages.length;

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  const handleNextClick = () => {
    if (currentPage < noOfPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  return (
    <Pagination className='transform scale-75'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious className='pr-2' onClick={handlePrevClick} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive={currentPage === 1}>
            {
              currentPage < 3 ? 1 :
              currentPage > noOfPages - 2 ? noOfPages - 2 :
              currentPage - 1}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive={currentPage != 1 && currentPage != noOfPages}>
            {
              currentPage < 3 ? 2 :
              currentPage > noOfPages - 2 ? noOfPages - 1 :
              currentPage
            }
          </PaginationLink>
        </PaginationItem>
        {
          noOfPages > 2 && <PaginationItem>
            <PaginationLink isActive={currentPage === noOfPages}>
              {
                currentPage < 3 ? 3 :
                currentPage > noOfPages - 2 ? noOfPages :
                currentPage + 1
              }
            </PaginationLink>
          </PaginationItem>
        }
        {
          pages.length > 3 && currentPage < noOfPages - 1 && <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        }
        <PaginationItem>
          <PaginationNext className='pl-2' onClick={handleNextClick} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationSection;
