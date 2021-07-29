import './style.css'
const BorderOpacity = props =>{
    const {borderWidth,borderColor,borderStyle,opacity,borderRadius} = props;
    return <div className="border-opacity-box" style={{padding:borderWidth}}>
        <div className="border-opacity-border" style={{
            inset:0,border:`${borderWidth}px ${borderStyle} ${borderColor}`,
            borderRadius:borderRadius,
            opacity:opacity
        }}></div>
        {props.children}
    </div>
}
BorderOpacity.defaultProps = {
    borderWidth:1,
    borderColor:'currentColor',
    borderStyle:'solid',
    borderRadius:0,
    opacity:1
}
export default BorderOpacity;