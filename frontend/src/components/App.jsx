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
            <MultiFunction />
            {(files ?? []).map((uuid) => {
                return <Image key={uuid} uuid={uuid} />
            })}
        </div>
    )
}

export default App;