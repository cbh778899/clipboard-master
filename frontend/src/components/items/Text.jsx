import propTypes from 'prop-types'
import { memo, useCallback, useEffect, useState } from 'react';
import requests from '../../utils/requests';

function Text({ uuid }) {

    const [content, setContent] = useState('');

    useEffect(() => {
        if (!uuid) return;

        (async()=>{
            const { error, content } = await requests(`items/text?uuid=${uuid}`);
            if (error) {
                console.error(error);
                return;
            }

            setContent(content);
        })()
    }, [uuid])

    const copyText = useCallback(()=>{
        navigator.clipboard.writeText(content);
    }, [content])

    return (
        <pre className='text' onClick={copyText}>
            { content }
        </pre>
    )
}

Text.propTypes = {
    uuid: propTypes.string.isRequired,
    type: propTypes.string.isRequired
}

export default memo(Text);