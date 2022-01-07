
export function triggerArchiveSync() {
    return callCgi('cgi-bin/trigger_sync.sh', 'trigger sync');
}

export async function reboot() {
    await callCgi('cgi-bin/reboot.sh', 'reboot');
    await delay(5000);
    while (!(await checkAlive())) {
        await delay(1000);
    }
}

async function checkAlive() {
    const search = new URLSearchParams({t: Math.random()});
    const response = await fetch('index.html?' + search, {method: 'GET'});
    return response.ok;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function callCgi(url, action) {
    const response = await fetch(url, {method: 'GET'});
    if (!response.headers.get('content-type').includes('text')) {
        throw new Error(`fail to ${action}`);
    }
    return response.text();
}
