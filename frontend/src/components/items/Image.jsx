import PropTypes from 'prop-types';
import useCache from '../../hooks/useCache';
import { copyImage } from '../../utils/tools';
import { memo } from 'react';

function Image({ uuid }) {
    const objURL = useCache(uuid);

    return (
        <img
            onClick={()=>copyImage(uuid, objURL)}
            src={objURL} alt={uuid}
        />
    )
}

Image.propTypes = {
    uuid: PropTypes.string.isRequired,
}

export default memo(Image);