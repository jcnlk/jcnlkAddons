import config from "../../config";
import { registerWhen } from "../../utils/Register";

registerWhen(register("chat", (event) => cancel(event)).setCriteria("UwUaddons »").setContains(), () => config.hideUwUAddons);