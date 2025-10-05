export const handlePageChange = (
  direction: "next" | "prev",
  currentPage: number,
  setPage: (newPage: number) => void,
) => {
  const newPage = direction === "next" ? currentPage + 1 : Math.max(1, currentPage - 1);
  setPage(newPage);
};
