import TouchRipple from "@material-ui/core/ButtonBase/TouchRipple";
import { useRef } from "react";

const RippleLayout = ({ children, ...rest }) => {
    const rippleRef = useRef(null);
    return <div {...rest}
        onMouseDown={e => rippleRef.current.start(e)}
        onMouseUp={e => rippleRef.current.stop(e)}
        onBlur={e => rippleRef.current.stop(e)}>
        {children}
        <TouchRipple ref={rippleRef} center={false} />
    </div>

}
export default RippleLayout;