import {BrowserWindow, MenuItemConstructorOptions, app} from 'electron';
const { dialog, shell } = require('electron')
export default (
  commandKeys: Record<string, string>,
  execCommand: (command: string, focusedWindow?: BrowserWindow) => void
): MenuItemConstructorOptions => {
  const isMac = process.platform === 'darwin';

  return {
    label:  'Help',
    submenu: [
      {
        label: `About Forge Desktop version ${app.getVersion()}`,
        click(item, focusedWindow) {
          dialog.showMessageBox({
            title: `About Forge`,
            message: `Version info`,
            detail: `Forge Desktop version ${app.getVersion()}`,
            buttons: [],
          });
        }
      },
      {
        label: 'Report an issue',
        click(item, focusedWindow) {
          shell.openExternal('https://github.com/openibank/forge/issues/new?template=bug_report.md')
        }
      }
    ]
  };
};
