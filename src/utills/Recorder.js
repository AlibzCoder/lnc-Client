export default class Recorder {
    #mediaRecorder
    constructor(onStart=()=>{},onStop=()=>{}){
        this.onStart = onStart;
        this.onStop = onStop;
        this.audioChunks = [];
    }

    init(){
        return new Promise(async (resolve, reject) => {
            try{
                this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.recording = false;
                this.#mediaRecorder = new MediaRecorder(this.stream);
                this.#mediaRecorder.addEventListener("dataavailable", event => {this.audioChunks.push(event.data);});
                this.#mediaRecorder.addEventListener("start", () => {this.onStart();this.recording = true;});
                this.#mediaRecorder.addEventListener("stop", () => {
                    this.onStop(this.audioChunks);
                    this.stream.getTracks().forEach(function(track) {track.stop();});
                });
                resolve(true);
            }catch(e){reject(e);}
        });
    }

    start(){if(this.#mediaRecorder!=undefined&&this.#mediaRecorder!=null&&!this.recording)this.#mediaRecorder.start()}
    stop(){if(this.#mediaRecorder!=undefined&&this.#mediaRecorder!=null&&this.recording)this.#mediaRecorder.stop();}



    static BlobToAudio (blob){        
        const audioUrl = URL.createObjectURL(blob);
        return new Audio(audioUrl);
    }

}
