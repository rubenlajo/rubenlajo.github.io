import { module } from "amiga-core/application";
import messages from "./messages/index";
import reactions from "./reactions";
import routes from "./routes";
import reducer from "./reducers";

export default module({
  key: "application",
  reactions,
  messages,
  routes,
  reducer,
});
