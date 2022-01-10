import i18nManager from 'veui/managers/i18n';
import 'veui/locale/en-US';
import 'veui/locale/zh-Hans';
import './en-US';
import './zh-Hans';

i18nManager.locale = getLocale();
export default i18nManager;


function getLocale() {
    const query = new URLSearchParams(location.search);
    return query.get('locale') || 'en-US';
}

export const availableLocales = [
    {
        label: 'English',
        value: 'en-US',
        short: '🇬🇧',
    },
    {
        label: '简体中文',
        value: 'zh-Hans',
        short: '🇨🇳',
    }
];
