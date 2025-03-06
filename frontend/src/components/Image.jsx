import PropTypes from 'prop-types';
import useCache from '../hooks/useCache';
import { copyImage } from '../utils/tools';
import { memo, useCallback } from 'react';

function Image({ uuid }) {

    const objURL = useCache(uuid);
    
    const onDragStart = useCallback(e => {
        e.dataTransfer.setData('to-remove', uuid);
    }, [uuid])

    const onDragEnd = useCallback(e => {
        e.dataTransfer.clearData('to-remove');
    }, [])

    return (
        <div 
            className='block clickable'
            onClick={()=>copyImage(uuid, objURL)}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        >
            <img
                src={objURL} alt={uuid}
            />
        </div>
    )
}

Image.propTypes = {
    uuid: PropTypes.string.isRequired,
}

export default memo(Image);