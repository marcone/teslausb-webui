import { callCgi } from './common';

const groups = ['RecentClips', 'SavedClips', 'SentryClips'];

export async function getVideoList() {
    const content = await callCgi('cgi-bin/videolist.sh', 'get video list');
    const paths = content.split('\n');
    const groups = paths.reduce(function (result, path) {
        const [group, sequenceName, filename] = path.split('/');
        if (filename.includes('~') || sequenceName.includes('json')) {
            return result;
        }

        if (!result[group]) {
            result[group] = {};
        }
        if (!result[group][sequenceName]) {
            result[group][sequenceName] = { clips: {} };
        }

        const sequence = result[group][sequenceName];
        if (filename.includes('.mp4')) {
            const {key, date, pos} = parseMp4Filename(filename);
            if (!sequence.clips[key]) {
                sequence.clips[key] = {key, date};
            }
            sequence.clips[key][pos] = filename;
        }
        else if (filename.includes('thumb')) {
            sequence.thumb = filename;
        }
        else if (filename.includes('json')) {
            sequence.jsonfile = filename;
        }

        return result;
    }, {});

    for (const sequences of groups) {
        for (const sequence of sequences) {
            sequence.clips = Object.values(sequence.clips).sort((a, b) => a.date - b.date);
        }
    }

    return groups;
}

export function getVideoURL(group, sequenceName, filename) {
    return ['TeslaCam', group, sequenceName, filename].join('/');
}

function parseMp4Filename(filename) {
    // example: 2022-01-06_10-27-31-left_repeater.mp4
    const [dateStr, rest] = filename.split('.')[0].split('_');
    const [year, month, day] = dateStr.split('-');
    const [hour, minute, second, pos] = rest.split('-');
    const date = new Date(year, month - 1, day, hour, minute, second);
    return {date, key: `${dataStr}_${hour}-${minute}-${second}`, pos};
}

export function getVideoInfo(url) {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    const promise = new Promise(function (resolve, reject) {
        video.addEventListener('loadedmetadata', function () {
            resolve({
                duration: video.duration,
                width: video.videoWidth,
                height: video.videoHeight,
            });
        });
        video.addEventListener('error', reject);
    });
    video.src = url;
    return promise;
}
