import {cacheBustinguURL, delay, callCgi} from './helper';

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

export async function toggleDrives() {
    await callCgi('/cgi-bin/toggledrives.sh', 'toggledrives');
}

export async function getPiStatus() {
    const res = await callCgi('/cgi-bin/status.sh', 'getPiStatus');
    const result = JSON.parse(res);
    return {
        freeSize: parseInt(result.free_space, 10),
        totalSize: parseInt(result.total_space, 10),
        snapCount: parseInt(result.num_snapshots, 10),
        snapOldest: parseInt(result.snapshot_oldest, 10),
        snapNewest: parseInt(result.snapshot_newest, 10),
        cpuTemp: parseInt(result.cpu_temp, 10),
        drivesActive: result.drives_active,
        uptime: parseInt(result.uptime, 10)
    };
}

async function checkAlive() {
    const url = cacheBustinguURL('index.html');
    const response = await fetch(url, {method: 'GET'});
    return response.ok;
}
