import requests, { generateRequestRoute } from '../../utils/requests';
import PropTypes from 'prop-types';
import { memo, useEffect, useState } from 'react';

function File({ uuid }) {

    const [ filename, setFileName ] = useState('');
    const [ downloadLink, setDownloadLink ] = useState('');

    useEffect(()=>{
        if (!uuid) return;

        setDownloadLink(generateRequestRoute(`items/file?uuid=${uuid}`));
        (async()=>{
            const { error, filename } = await requests(`items/file?uuid=${uuid}&request_name=1`);
            if (error) {
                console.error(error);
                return;
            }

            setFileName(filename);
        })()
    }, [uuid])


    return (
        <a className='file-download-link' href={downloadLink} download={filename}>
            <div className='instruction'>Click to download</div>
            <strong className='filename'>{filename}</strong>
        </a>
    )
}

File.propTypes = {
    uuid: PropTypes.string.isRequired,
}

export default memo(File);