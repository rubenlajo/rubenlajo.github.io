import { module } from "amiga-core/application";
import routes from "./routes/";
import reducer from "./reducers/";
import messages from "./messages/";
import reactions from "./reactions";

export default module({
  key: "stock",
  // menu,
  routes,
  reactions,
  reducer,
  messages,
});
