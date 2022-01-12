import {cacheBustinguURL, delay, callCgi} from './common';

export function triggerArchiveSync() {
    return callCgi('/cgi-bin/trigger_sync.sh', 'trigger sync');
}

export async function reboot() {
    await callCgi('/cgi-bin/reboot.sh', 'reboot');
    await delay(5000);
    while (!(await checkAlive())) {
        await delay(1000);
    }
}

async function checkAlive() {
    const url = cacheBustinguURL('index.html');
    const response = await fetch(url, {method: 'GET'});
    return response.ok;
}
