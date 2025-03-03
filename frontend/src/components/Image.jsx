import PropTypes from 'prop-types';
import useCache from '../hooks/useCache';
import { copyImage } from '../utils/tools';

function Image({ uuid }) {

    const objURL = useCache(uuid);

    return (
        <div 
            className='block clickable'
            onClick={()=>copyImage(uuid, objURL)}
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

export default Image;