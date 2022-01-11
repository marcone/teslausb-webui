
const common = {
    'diagnostics': 'Diagnostics',
    'archiveloop-log': 'ArchiveLoop Log',
    'setup-log': 'Setup Log',
    'tools': 'Tools',
    'recordings': 'Recordings',
    'viewer': 'Viewer',
}

export const AppRoot = common;

export const LogPage = common;
export const LogView = {
    'loading': 'Loading...',
    'download': 'Download ${title}',
};

export const DiagnosticsPage = {
    ...common,
    generating: 'Generating...',
};

export const Tools = {
    'trigger-sync': 'Trigger archive/sync',
    'trigger-success': 'Sync triggered',
    'reboot-raspi': 'Restart Raspberry Pi',
    'reboot-confirm-content': 'Are you sure you want to restart the Raspberry Pi?',
    'reboot-confirm-title': 'Restart Raspberry Pi',
    'reboot-confirm-ok-label': 'Restart',
    'reboot-success': 'Rebooted',
};

export const Viewer = {
    layout: 'Layout',
    RecentClips: 'RecentClips',
    SavedClips: 'SavedClips',
    SentryClips: 'SentryClips',
    'layout-1': 'Sides on top, rear on bottom, mirrored',
    'layout-2': 'Side and rear on bottom, mirrored',
    'layout-3': 'Side and rear on bottom, looking back',
    'episode-select-placeholder': 'Select an episode',
};
