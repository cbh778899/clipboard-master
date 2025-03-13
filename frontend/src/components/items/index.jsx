import propTypes from 'prop-types'
import Image from './Image'
import Text from './Text';
import { memo } from 'react';
import File from './File';

function Item({ uuid, type }) {

    return (
        <div 
            className='block clickable'
            data-to-remove={uuid}
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