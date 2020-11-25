import ControllerInfoContext from "@src/contexts/controller-info-context";
import { useContext } from "react";

const useControllerInfo = () => useContext(ControllerInfoContext);

export default useControllerInfo;