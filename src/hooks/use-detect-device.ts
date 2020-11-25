import { Device } from "@src/types";
import { useEffect, useState } from "react";

const useDetectDevice = () => {
    const [type, setType] = useState<Device>(Device.desktop);

    useEffect(() => {
        const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;

        const mobileRegexPattern = /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i;
        const matchesMobile = Boolean(userAgent.match(mobileRegexPattern));

        if(matchesMobile) {
            setType(Device.mobile);
        }
    }, []);

    return type;
};

export default useDetectDevice;