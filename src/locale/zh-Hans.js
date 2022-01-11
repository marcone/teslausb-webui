
const common = {
    'diagnostics': '诊断',
    'archiveloop-log': '归档日志',
    'setup-log': '安装日志',
    'tools': '工具',
    'recordings': '行车视频列表',
    'viewer': '查看行车视频',
}

export const AppRoot = common;

export const LogPage = common;
export const LogView = {
    'loading': '加载中...',
    'download': '下载${title}',
};

export const DiagnosticsPage = {
    ...common,
    generating: '生成中...',
};

export const Tools = {
    'trigger-sync': '触发归档/同步',
    'trigger-success': '已触发',
    'reboot-raspi': '重启树莓派',
    'reboot-confirm-content': '确定要重启树莓派吗?',
    'reboot-confirm-title': '重启树莓派',
    'reboot-confirm-ok-label': '重启',
    'reboot-success': '已重启',
};

export const Viewer = {
    layout: '布局',
    RecentClips: '最近',
    SavedClips: '已保存',
    SentryClips: '哨兵',
    'layout-1': '两侧在上（镜像）',
    'layout-2': '两侧在下（镜像）',
    'layout-3': '两侧在下',
    'episode-select-placeholder': '选择片段',
};
