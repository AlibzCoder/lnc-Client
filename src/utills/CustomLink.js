import {Link} from "react-router-dom";
export default ({disabled,children,...rest}) => {
    return disabled ? <span className="disabled-url">{children}</span> : <Link {...rest}>{children}</Link>
}