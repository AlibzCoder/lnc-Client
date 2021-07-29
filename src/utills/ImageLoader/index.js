import React, {Suspense,useState} from 'react'


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    //console.log(error)
    //console.log(errorInfo)
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

const readImage = (src) => {
  let img;
  let status = 'loading';
  let error;
  const imgPromise = new Promise((resolve,reject) => {
    img = new Image();
    img.onload = () => {
      status = 'done';
      resolve(true)
    };
    img.onerror = (err) => {
      error = err;
      status = 'error';
      reject(err);
    };
    img.src = src;
  })
  return () => {
    if (status === 'loading') {
      throw imgPromise;
    } else if (status === 'error') {
      throw error;
    }
    return img;
  }
};

export const SuspenseImg = ({ src,readImage, ...rest }) => {
    readImage()
    return <img src={src} {...rest} />;
};

const ImageLoader = React.memo((props) =>{
  const [imgReader] = useState(() => readImage(props.src));
  return (
    <ErrorBoundary fallback={props.unloader??<div></div>}>
      <Suspense fallback={props.loader??<div></div>}>
        <SuspenseImg src={props.src} readImage={imgReader} {...props.imgProps}  />
      </Suspense>
    </ErrorBoundary>
  )
},(prevProps,nextProps)=>{return prevProps.src === nextProps.src;})

export default ImageLoader