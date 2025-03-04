import c from 'classnames'
import { memo, useCallback, useState } from 'react';
import { readFromClipboard, watchDropEvent } from '../utils/tools';

function MultiFunction() {

    const [ isDragOver, setIsDragOver ] = useState(false);

    const handleDrop = useCallback((event) => {
        event.preventDefault();
        setIsDragOver(false);
        watchDropEvent(event);
    }, []);

    return (
        <div 
            className={c('block', 'clickable', 'multi-function', { dragover: isDragOver })}
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
            }}
            onDragLeave={() => {
                setIsDragOver(false);
            }}
            onDrop={handleDrop}
            onClick={readFromClipboard}
        />
    )
}

export default memo(MultiFunction);
