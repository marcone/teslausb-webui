import {defaultsDeep} from 'lodash';
import i18nManager from 'veui/managers/i18n';
import 'veui/locale/en-US';
import 'veui/locale/zh-Hans';
import * as enUs from './en-US';
import * as zhHans from './zh-Hans';

i18nManager.locale = getLocale();
export default i18nManager;

register('en-US', enUs);
register('zh-Hans', zhHans, enUs);

function register(locale, map, ...fallbacks) {
    const mapWithFallback = defaultsDeep({}, map, ...fallbacks);
    Object.entries(mapWithFallback).forEach(([ns, data]) => {
        i18nManager.register(locale, data, {ns: prefixNs(ns)});
    });
}

function getLocale() {
    const query = new URLSearchParams(location.search);
    return query.get('locale') || localStorage.getItem('locale') || 'en-US';
}

export function setLocale(val) {
    i18nManager.locale = val;
    localStorage.setItem('locale', val);
    const {pathname, search, hash} = location;
    const query = new URLSearchParams(search);
    query.set('locale', val);
    history.replaceState(null, '', `${pathname}?${query.toString()}${hash}`);
}

export function prefixNs(ns) {
    return 'TeslaUSB-' + ns;
}

export const availableLocales = [
    {
        label: 'English',
        value: 'en-US',
        short: '🇺🇸',
    },
    {
        label: '简体中文',
        value: 'zh-Hans',
        short: '🇨🇳',
    }
];
