import { registerWhen } from "../../utils/Utils";
import config from "../../config";

registerWhen(register("chat", (event) => cancel(event)).setCriteria("UwUaddons »").setContains(), () => config.hideUwUAddons);