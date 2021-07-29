import React , {useState , useEffect} from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ImageLoader from "../../utills/ImageLoader";
import './zoomComponent.css'

const ZoomComponent = (props) => {
    
    const [display,setDisplay] = useState(false)

    useEffect(()=>{
        setDisplay(props.display)
    },[props.display])

    return (<div>
        <div className="zoom-component" style={(display)?{top:0}:null}>
            <div className="zoom-box">
                <TransformWrapper
                    wheel={{disabled:false,step:100,wheelEnabled:true,touchPadEnabled:true,limitsOnWheel:true}}
                    doubleClick={{disabled:false,mode:'reset',step:100,animation:true,animationTime:300,animationType:'easeOut'}}>
                    {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                        <React.Fragment>
                            <div className="zoom-component-back" onClick={()=>{resetTransform();setTimeout(()=>{props.Close()},300)}}></div>
                            <TransformComponent>
                                <div className={`zoom-img aspect-${(props.aspect.replace(':','-'))}`}>
                                    <ImageLoader placeholder={null} src={props.src} backUpSrc={props.backUpSrc}/>
                                </div>
                            </TransformComponent>
                        </React.Fragment>
                    )}
                </TransformWrapper>
            </div>
        </div>
    </div>)
}
export default ZoomComponent