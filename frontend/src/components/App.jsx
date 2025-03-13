import useSocket, { closeWsClient, initClient } from "../hooks/useSocket";
import { useEffect } from "react";
import { watchPasteImageEvent } from "../utils/tools";
import MultiFunction from "./MultiFunction";
import Item from "./items";

function App() {

    const items = useSocket('items');

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
            {(items ?? []).map(({uuid, type}) => {
                return <Item key={uuid} uuid={uuid} type={type} />
            })}
        </div>
    )
}

export default App;