import propTypes from 'prop-types'
import Image from './Image'
import Text from './Text';
import { memo, useCallback } from 'react';
import File from './File';

function Item({ uuid, type }) {

    const onDragStart = useCallback(e => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('to-remove', uuid);
    }, [uuid])

    const onDragEnd = useCallback(e => {
        e.dataTransfer.clearData('to-remove');
    }, [])

    return (
        <div 
            className='block clickable'
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            draggable
        >
            {
                type === 'image' ? 
                <Image uuid={uuid} /> :
                type === 'text' ?
                <Text uuid={uuid} /> :
                <File uuid={uuid} />
            }
        </div>
    )
}

Item.propTypes = {
    uuid: propTypes.string.isRequired,
    type: propTypes.string.isRequired
}

export default memo(Item);