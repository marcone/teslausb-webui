export function cacheBustinguURL(url) {
    return url + '?' + (new URLSearchParams({_t: Math.random()}));
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function callCgi(url, action) {
    const response = await fetch(url, {method: 'GET'});
    if (!response.headers.get('content-type').includes('text')) {
        throw new Error(`fail to ${action}`);
    }
    return response.text();
}