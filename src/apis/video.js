import {fromPairs, mapValues, last, intersection} from 'lodash';
import dayjs from 'dayjs';
import {positions} from '@/common';
import { callCgi } from './helper';

export async function getVideoList() {
    const content = await callCgi('/cgi-bin/videolist.sh', 'get video list');
    const paths = content.split('\n').filter(line => line.trim());
    const groups = paths.reduce(function (result, path) {
        const [group, sequenceName, filename] = path.split('/');
        if (filename.includes('~') || sequenceName.includes('json') || sequenceName.includes('thumb')) {
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

    for (const [, sequences] of Object.entries(groups)) {
        for (const [, sequence] of Object.entries(sequences)) {
            sequence.clips = Object.values(sequence.clips).sort((a, b) => a.date - b.date);
            sequence.clips = sequence.clips.filter(clip => intersection(Object.keys(clip), positions).length === 4);
        }
    }

    // normalize levels into group/date/time
    return mapValues(groups, function (sequences, groupName) {
        if (groupName === 'RecentClips') {
            // RecentClips/2021-12-03/2021-12-03_08-10-41-left_repeater.mp4
            return mapValues(sequences, function ({clips}, dirName) {
                const dates = groupDates(clips.map(clip => clip.date));
                return dates.reduce(function (ret, date, index) {
                    const key = dayjs(date).format('HH:mm:ss');
                    const i = clips.findIndex(clip => clip.date === date);
                    const j = dates[index + 1] ? clips.findIndex(clip => clip.date === dates[index + 1]) : clips.length;
                    ret[key] = {clips: clips.slice(i, j), date, group: groupName, sequence: dirName};
                    return ret;
                }, {});
            });
        }

        // SavedClips/2021-12-24_20-38-38/2021-12-24_20-36-14-left_repeater.mp4
        return Object.entries(sequences).reduce(function (ret, [sequenceName, sequence]) {
            const {date} = parseDirname(sequenceName);
            const key = dayjs(date).format('YYYY-MM-DD');
            if (!ret[key]) {
                ret[key] = {};
            }
            ret[key][dayjs(date).format('HH:mm:ss')] = {...sequence, date, group: groupName, sequence: sequenceName};
            return ret;
        }, {});
    });
}

function groupDates(dates) {
    const gap = 3600 * 1000;
    return dates.slice(1).reduce(function (ret, date) {
        if (date - last(ret) > gap) {
            ret.push(date);
        }
        return ret;
    }, [dates[0]]);
}

export function getVideoURL(group, sequenceName, filename) {
    return ['/TeslaCam', group, sequenceName, filename].join('/');
}

function parseMp4Filename(filename) {
    // example: 2022-01-06_10-27-31-left_repeater.mp4
    const [, year, month, day, hour, minute, second, pos]
        = filename.match(/^(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})-(\w+)\./);
    const date = new Date(year, month - 1, day, hour, minute, second);
    return {date, key: `${year}-${month}-${day}_${hour}-${minute}-${second}`, pos};
}

function parseDirname(dirname) {
    const [, year, month, day, hour, minute, second, pos]
        = dirname.match(/^(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})$/);
    const date = new Date(year, month - 1, day, hour, minute, second);
    return {date};
}

export function getVideoInfo(url) {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    const promise = new Promise(function (resolve, reject) {
        video.addEventListener('loadedmetadata', function () {
            resolve({
                duration: video.duration,
                width: video.videoWidth,
                height: video.videoHeight,
            });
        });
        video.addEventListener('error', function (e) {
            reject(video.error);
        });
    });
    video.src = url;
    return promise;
}
