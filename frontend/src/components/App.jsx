import Image from "./Image";
import useSocket, { closeWsClient, initClient } from "../hooks/useSocket";
import { useEffect } from "react";
import { watchPasteImageEvent } from "../utils/tools";
import MultiFunction from "./MultiFunction";

function App() {

    const files = useSocket('files');

    useEffect(()=>{
        initClient();
        document.addEventListener('paste', watchPasteImageEvent);
        return () => {
            closeWsClient();
            document.removeEventListener('paste', watchPasteImageEvent);
        }
    }, [])

    return (
        <div className="main">
            {
                files && files.length ? 
                
                <>
                <MultiFunction />
                {files.map((uuid) => {
                    return <Image key={uuid} uuid={uuid} />
                })}
                </> :

                <div className="empty">
                    Paste An Image to Start
                </div>
            }
        </div>
    )
}

export default App;