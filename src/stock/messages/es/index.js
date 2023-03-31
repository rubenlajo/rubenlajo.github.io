import es from "./stock.json";
import locationsES from "./locations.json";
import referencesES from "./references.json";
import ordersES from "./orders.json";
import warehouseMovementsES from "./warehouse-movements.json";
import pdaES from "./pda.json";

export default {
  ...es,
  ...locationsES,
  ...ordersES,
  ...referencesES,
  ...warehouseMovementsES,
  ...pdaES,
};
