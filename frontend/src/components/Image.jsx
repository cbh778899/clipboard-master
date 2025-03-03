import PropTypes from 'prop-types';
import useCache, { getFileBlob } from '../hooks/useCache';

function Image({ uuid }) {

    const objURL = useCache(uuid);

    function copyImgToClipboard() {
        if (!objURL) return;

        const blob = getFileBlob(uuid);
        if (!blob) return;

        navigator.clipboard.write([
            new ClipboardItem({
                [blob.type]: blob
            })
        ]);
    }

    return (
        <div 
            className='block clickable'
            onClick={copyImgToClipboard}
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