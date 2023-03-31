export const SIZES = {
  XS: "size-xs",
  S: "size-s",
};
const SIZE_XS = "1.8rem";
const SIZE_S = "2.4rem";
const SIZE_S_BREADCRUMB = "1.6rem";
const SIZE_M = "3.2rem";

const getBreadcrumbIconSize = (size) => {
  switch (size) {
    case SIZES.S:
      return SIZE_S_BREADCRUMB;
    default:
      return SIZE_S;
  }
};

const getButtonIconSize = (size) => {
  switch (size) {
    case SIZES.XS:
      return SIZE_XS;
    case SIZES.S:
      return SIZE_S;
    default:
      return SIZE_M;
  }
};
export { getBreadcrumbIconSize, getButtonIconSize };
