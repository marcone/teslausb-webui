
const common = {
    'diagnostics': '诊断',
    'archiveloop-log': '归档日志',
    'setup-log': '安装日志',
    'tools': '工具',
    'recordings': '行车视频列表',
    'viewer': '查看行车视频',
}

const datePickerShortcuts = {
    'thisMonth': '本月',
    'thisWeek': '本周',
    'last7days': '最近7天',
    'today': '今天',
};

export const AppRoot = common;

export const Header = {
    'back-to-legacy': '回到旧版',
};

export const LogPage = common;
export const LogView = {
    'loading': '加载中...',
    'download': '下载{title}',
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
    'layout-4': '更大前摄，两侧在下（镜像）',
    'layout-5': '最大前摄，两侧在下（镜像）',
    'episode-select-placeholder': '选择片段',
    'fetching-video-list': '加载视频列表...',
    'fetch-video-list-error': '加载视频列表失败',
    'fetching-video-detail': '加载视频详情...',
    'fetch-video-detail-error': '加载视频详情失败',
    'detect-video-error': '无法识别视频',
    'user_interaction_dashcam_icon_tapped': '点击了行车记录仪图标',
    ...datePickerShortcuts,
    'no-video-found': '没有视频',
    'no-video-found-in-range': '选定的范围内没有视频',
};
