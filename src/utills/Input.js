const Input = ({icon,neumorphic,error,...rest}) => {
    return <div className={`input ${neumorphic?'inset-neumorphic-shadow':''} ${icon?'input-icon':''} ${error?'input-error':''}`}>
        {icon??null}
        <input {...rest} />
    </div>
}
export default Input;