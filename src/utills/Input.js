import { InputBase } from "@material-ui/core";

const Input = ({icon,neumorphic,error,multiline,...rest}) => {
    return <div className={`input
        ${multiline?'input-multiline':''} 
        ${neumorphic?'inset-neumorphic-shadow':''}
        ${icon?'input-icon':''}
        ${error?'input-error':''}`}>
        {icon??null}
        <InputBase {...multiline?{multiline:multiline}:{}} {...rest} />
    </div>
}
export default Input;