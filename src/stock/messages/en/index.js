import en from "./stock.json";
import locationsEN from "./locations.json";
import ordersEN from "./orders.json";
import referencesEN from "./references.json";
import warehouseMovementsEN from "./warehouse-movements.json";
import pdaEn from "./pda.json";

export default {
  ...en,
  ...locationsEN,
  ...ordersEN,
  ...referencesEN,
  ...warehouseMovementsEN,
  ...pdaEn,
};
