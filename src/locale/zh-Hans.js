import i18n from 'veui/managers/i18n';

function register(ns, data) {
    i18n.register('zh-Hans', data, {ns: 'TeslaUSB-' + ns});
}

const common = {
    'diagnostics': '诊断',
    'archiveloop-log': '归档循环日志',
    'setup-log': '安装日志',
    'tools': '工具',
    'recordings': '行车视频列表',
    'viewer': '查看行车视频',
}

register('AppRoot', common);

register('LogPage', common);
register('LogView', {
    'download': '下载${title}',
});

register('DiagnosticsPage', {
    ...common,
    generating: '生成中...',
});

register('Tools', {
    'trigger-sync': '触发归档/同步',
    'trigger-success': '已触发',
    'reboot-raspi': '重启树莓派',
    'reboot-confirm-content': '确定要重启树莓派吗?',
    'reboot-confirm-title': '重启树莓派',
    'reboot-confirm-ok-label': '重启',
    'reboot-success': '已重启',
});
