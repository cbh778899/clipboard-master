import c from 'classnames'
import { memo, useCallback, useState } from 'react';
import { readFromClipboard, handleDropFile, deleteFile } from '../utils/tools';

function MultiFunction() {

    const [ isDragOver, setIsDragOver ] = useState(false);
    const [ isDelete, setIsDelete ] = useState(false);

    const handleDrop = useCallback((event) => {
        event.preventDefault();

        const removeUUID = event.dataTransfer.getData('to-remove');
        if (removeUUID) {
            deleteFile(removeUUID);
        } else {
            handleDropFile(event);
        }

        setIsDragOver(false);
        setIsDelete(false);
    }, []);

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDelete(e.dataTransfer.types.includes('to-remove'));
        setIsDragOver(true);
    }, [])

    const onDragLeave = useCallback(() => {
        setIsDragOver(false);
    }, [])

    return (
        <div 
            className={c('block', 'clickable', 'multi-function', { dragover: isDragOver, deleting: isDelete })}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={handleDrop}
            onClick={readFromClipboard}
        />
    )
}

export default memo(MultiFunction);
