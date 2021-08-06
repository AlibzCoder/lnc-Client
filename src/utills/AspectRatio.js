import { useEffect ,useState } from "react";

const calculateAspectRaito = aspect => {
    const [widthAspect,heightAspect] = aspect;
    let output = ((Math.round(heightAspect) / Math.round(widthAspect)) * 100).toFixed(2);
    if (output > 0) return output.replace(".00", "") + "%"
    return 0;
}

const AspectRatio = ({ aspect = [1,1], children ,...rest }) => {
    
    const [paddingTop,setPaddingTop] = useState(0)
    useEffect(()=>{if(aspect&&aspect instanceof Array) setPaddingTop(calculateAspectRaito(aspect))},[aspect])

    return <div className="aspect-box" {...rest}>
        <div className="aspect" style={{paddingTop:paddingTop}}>
            {children}
        </div>
    </div>
}
export default AspectRatio;