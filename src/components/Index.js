import { useEffect } from "react"
import { useCookies } from "react-cookie";
import Shimmer from "react-shimmer-effect";
import history from "../history";

const Index = ()=>{
    const [cookies, setCookie, removeCookie] = useCookies();
    useEffect(()=>{history.replace("Authorization" in cookies?'/Main':'/Login')},[])
    return <Shimmer><div className="page"></div></Shimmer>
}
export default Index