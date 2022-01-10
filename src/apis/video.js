import { callCgi } from './common';

const groups = ['RecentClips', 'SavedClips', 'SentryClips'];

export async function getVideoList() {
    const content = await callCgi('cgi-bin/videolist.sh', 'get video list');
    const paths = content.split('\n');
    const videos = paths.reduce(function (result, path) {
        const [group, sequenceName, filename] = path.split('/');
        if (filename.includes('~') || sequenceName.includes('json')) {
            return result;
        }

        if (!result[group]) {
            result[group] = {};
        }
        if (!result[group][sequenceName]) {
            result[group][sequenceName] = { videos: [] };
        }

        const sequence = result[group][sequenceName];
        if (filename.includes('.mp4')) {
            sequence.videos.push({
                filename,
                ...parseMp4Filename(filename)
            });
        }
        else if (filename.includes('thumb')) {
            sequence.thumb = filename;
        }
        else if (filename.includes('json')) {
            sequence.jsonfile = filename;
        }

        return result;
    }, {});
    // TODO: empty vidoes
    return videos;
}

function getVideoURL(group, sequenceName, filename) {
    return ['TeslaCam', group, sequenceName, filename].join('/');
}

function parseMp4Filename(filename) {
    const [dateStr, rest] = filename.split('.')[0].split('_');
    const [year, month, day] = dateStr.split('-');
    const [hour, minute, second, pos] = rest.split('-');
    const date = new Date(year, month - 1, day, hour, minute, second);
    return {date, dateStr, pos};
}
