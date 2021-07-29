import { Button, CircularProgress } from "@material-ui/core"

export default ({isLoading,LoaderSize = "1.5rem",children,...rest}) =>{
    return <Button {...rest}>
        {isLoading?<CircularProgress {...LoaderSize?{size:LoaderSize}:{}} color="inherit" />:children}
    </Button>
}