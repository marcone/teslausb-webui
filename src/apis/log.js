import {noop} from 'lodash';
import {cacheBustinguURL, delay} from './common';

function readFile(url, range) {
    const headers = new Headers();
    if (range) {
        headers.append('range', `bytes=${range.join('-')}`);
    }
    return fetch(cacheBustinguURL(url), {
        method: 'GET',
        headers
    });
}

export function readLiveFile(url, onUpdate = noop) {
    let fullContent;
    start();

    async function start() {
        if (onUpdate === noop) {
            return;
        }
        const response = await readFile(url);
        fullContent = await response.text();
        onUpdate(fullContent);
        next(fullContent.length);
    }

    async function next(offset) {
        if (onUpdate === noop) {
            return;
        }
        const response = await readFile(url, [offset - 1, offset + 32768]);
        if (response.status === 206) {
            const content = await response.text();
            fullContent += content.substring(1);
            onUpdate(fullContent);
            await delay(1000);
            next(fullContent.length);
        }
        else if (response.status === 416) {
            const res = await fetchAndFixTruncatedLog();
            if (res) {
                const [full, content] = res;
                fullContent = full;
                onUpdate(fullContent);
                await delay(1000);
                next(content.length);
            }
            else {
                onUpdate(undefined);
                await delay(1000);
                start();
            }
        }
    }

    async function fetchAndFixTruncatedLog() {
        const response = await readFile(url);
        const content = await response.text();
        const newPos = content.lastIndexOf(last(fullContent, 200));
        if (newPos >= 0) {
            const full = fullContent + content.substring(newPos + 200);
            return [full, content];
        }
    }

    return function stop() {
        onUpdate = noop;
    }
}

function last(content, len) {
    return content.substring(content.length - len);
}
