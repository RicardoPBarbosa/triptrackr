import useMediaQuery from "./useMediaQuery";

function numberOfItemsPerBreakpoint([isXs, isSm, isMd, isLg]: boolean[]) {
  switch (true) {
    case isXs:
      return 4;
    case isSm:
      return 6;
    case isMd:
      return 8;
    case isLg:
      return 10;
    default:
      return 10;
  }
}

export default function useListingSize() {
  const isXs = useMediaQuery("(max-width: 640px)");
  const isSm = useMediaQuery("(max-width: 768px)");
  const isMd = useMediaQuery("(max-width: 1024px)");
  const isLg = useMediaQuery("(max-width: 1280px)");

  return numberOfItemsPerBreakpoint([isXs, isSm, isMd, isLg]);
}
