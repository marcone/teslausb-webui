import i18n from 'veui/managers/i18n';

function register(ns, data) {
    i18n.register('en-US', data, {ns: 'TeslaUSB-' + ns});
}

const common = {
    'diagnostics': 'Diagnostics',
    'archiveloop-log': 'ArchiveLoop Log',
    'setup-log': 'Setup Log',
    'tools': 'Tools',
    'recordings': 'Recordings',
    'viewer': 'Viewer',
}

register('AppRoot', common);

register('LogPage', common);
register('LogView', {
    'download': 'Download ${title}',
});

register('DiagnosticsPage', {
    ...common,
    generating: 'Generating...',
});

register('Tools', {
    'trigger-sync': 'Trigger archive/sync',
    'trigger-success': 'Sync triggered',
    'reboot-raspi': 'Restart Raspberry Pi',
    'reboot-confirm-content': 'Are you sure you want to restart the Raspberry Pi?',
    'reboot-confirm-title': 'Restart Raspberry Pi',
    'reboot-confirm-ok-label': 'Restart',
    'reboot-success': 'Rebooted',
});
