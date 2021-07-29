import React, { useState, useEffect, useCallback } from 'react'
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import Cropper from 'react-easy-crop'
import './Crop.css'
import { getCroppedImg, getRotatedImage } from './canvasUtils'
import { Button, CircularProgress } from '@material-ui/core';


const Crop = (props) => {
  
  const [loading,setLoading] = useState(false)

  const [imageSrc, setImageSrc] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const [tempAspects,setTempAspects] = useState(props.CropAspects)
  const [seleectedAspect,setSeleectedAspect] = useState((props.CropAspect!==null)?props.CropAspect:props.CropAspects[0])

  const createImage = url =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', error => reject(error))
      image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
      image.src = url
    })
  function resizeImg(url){
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.onload = function () {
          var oc = document.createElement('canvas'),octx = oc.getContext('2d');

          var MAX_WIDTH = 800;
          var MAX_HEIGHT = 600;
          var width = img.width;
          var height = img.height;

          if (width > height) {
              if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
              }
          } else {
              if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
              }
          }

          oc.width = width;
          oc.height = height;
          octx.drawImage(img, 0, 0, oc.width, oc.height);
          resolve(oc.toDataURL("image/jpg"));
      }
      img.src = url
    })
  }

  

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }
  useEffect(()=>{
    async function setImageSrcFromProps(){
      if(props.src){
        let imageDataUrl = await readFile(props.src)
        const image = await resizeImg(imageDataUrl)
        setImageSrc(image)
      }
    }
    setImageSrcFromProps();
  },[props.src])
  
  useEffect(()=>{
    //reset States
    if(!props.modalVisablity){
      setImageSrc(null)
      setCrop({x:0,y:0})
      setRotation(0)
      setZoom(1)
      setCroppedAreaPixels(null)
      setLoading(false)
    }
  },[props.modalVisablity])


  useEffect(()=>{
    if(props.CropAspects===undefined)     
      setSeleectedAspect(props.CropAspect)
  },[props.CropAspect])

  const handleOk = async ()=>{
    try {
      setLoading(true)
      const croppedimg = await getCroppedImg(imageSrc,croppedAreaPixels,rotation,(props.CropShape=='round'))
      console.log(croppedimg);
      props.onCropDone(croppedimg)
      if(props.CropAspect === null){
        props.setCropAspect(seleectedAspect)
      }
    } catch (e) {console.error(e)}
  }
  const handleCancel = ()=>{
    props.onClose()
  }



  const handleAspectChange = (aspect)=>{
    if(aspect===seleectedAspect){
      var a = `${aspect.split(':')[1]}:${aspect.split(':')[0]}` // reverse the aspect
      var aspects = tempAspects;
      aspects[aspects.indexOf(aspect)] = a;
      setTempAspects(aspects)
      setSeleectedAspect(a)
    }else{
      setSeleectedAspect(aspect)
    }
  }

  return (
    <div className={`crop-box ${(props.modalVisablity)?'crop-box-active':''}`}>
      <div className="crop-back"></div>
      <div className="crop-body">
        <div className="crop-header">
          <Button style={{minWidth: 'unset',color:'#FFF'}} variant="text" onClick={handleCancel}><CloseIcon/></Button>
          <h4>{props.modalTitle}</h4>
          
          {(!loading)?(<Button style={{minWidth: 'unset',color:'#FFF'}} variant="text" onClick={handleOk}><CheckIcon/></Button>):(<div className="flex-center"><CircularProgress size="1rem" color="secondary" /></div>)}
        </div>
        <Cropper
          image={imageSrc}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={seleectedAspect.split(':')[0]/seleectedAspect.split(':')[1]}
          cropShape={props.CropShape}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          restrictPosition={true}/>
          <div className="crop-rotation">
            <div className="crop-rotation-left" onClick={()=>setRotation(rotation-90)}>
              <RotateLeftIcon/>
              - 90°
            </div>
            <div className="crop-rotation-right" onClick={()=>setRotation(rotation+90)}>
              <RotateRightIcon/>
              90°
            </div>
          </div>
          
          {(props.CropAspect===null)?(
            <div className="crop-aspect-control">
              {tempAspects.map((aspect)=>{
                return(
                  <div key={aspect} onClick={()=>{handleAspectChange(aspect)}}
                    className={`crop-aspect-control-item ${(aspect===seleectedAspect)?'crop-aspect-control-item-selected':''}`}>
                    <span>{aspect}</span>
                    <div className={`aspect-${(aspect.replace(':','-'))}`}></div>
                  </div>
                )
              })}
            </div>
          ):(null)}
      </div>
    </div>
  )
}

export default Crop

