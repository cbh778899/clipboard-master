const baseRoute = 
    import.meta.env.DEV ? 
    import.meta.env.VITE_DEV_BASE_ROUTE || 'http://localhost:3000/api' : 
    import.meta.env.VITE_PROD_BASE_ROUTE || '/api';


export function generateRequestRoute(route) {
    return `${baseRoute}${route.startsWith('/') ? '' : '/'}${route}`;
}

/**
 * @typedef RequestOptions
 * @property {boolean} autoParseBody
 * @property {boolean} jsonResponse
 * @property {string} attrNameOfError default to 'error'
 */

/**
 * wrap for fetch api
 * @param {RequestInfo | URL} input 
 * @param {RequestInit} init 
 * @param {RequestOptions} options
 */
export default async function requests(input, init = {}, options = {}) {

    const { 
        autoParseBody = true, 
        jsonResponse = true,
        attrNameOfError = 'error'
    } = options;

    input = generateRequestRoute(input);

    if (typeof init.body === 'object' && autoParseBody) {
        init.body = JSON.stringify(init.body);
    }

    if (init.method && init.method.toUpperCase() !== 'GET') {
        if (init.headers) {
            init.headers['Content-Type'] || (init.headers['Content-Type'] = 'application/json');
        } else {
            init.headers = { 'Content-Type': 'application/json' };
        }
    }

    const response = await fetch(input, init);
    if (!response.ok) {
        if (jsonResponse) {
            return { [attrNameOfError]: { code: response.status, message: response.statusText } }
        } else {
            return response;
        }
    }

    if (jsonResponse) {
        return await response.json();
    } else {
        return response;
    }
}


/**
* wrap for fetch api, default to {method: 'POST'}
* @param {RequestInfo | URL} input 
* @param {RequestInit} init 
* @param {RequestOptions} options
*/
export function POST(input, init, options) {
    init.method = 'POST';
    return requests(input, init, options);
}