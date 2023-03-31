import forms from "./forms.json";
import page from "./page.json";
import dateTime from "./dateTime.json";
import list from "./list.json";
import location from "./location-text.json";
import codeScanner from "./code-scanner.json";
import commentCard from "./comment-card.json";
import pageMobile from "./page-mobile.json";
import noData from "./no-data.json";
import mobileSlidePannel from "./mobile-slide-pannel.json";
import checkPermissions from "./check-permissions.json";
import filters from "./filters.json";
import editOTForm from "./EditOtForm.json";
import fullImage from "./full-image.json";

export default {
  ...dateTime,
  ...forms,
  ...page,
  ...list,
  ...location,
  ...codeScanner,
  ...commentCard,
  ...pageMobile,
  ...noData,
  ...mobileSlidePannel,
  ...checkPermissions,
  ...filters,
  ...editOTForm,
  ...fullImage,
};
