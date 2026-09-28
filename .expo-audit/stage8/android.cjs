// QA local: somente o emulador desta revisão, sem alterar o SDK ou o PATH global.
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const adb = 'C:/Users/leocp/AppData/Local/Android/Sdk/platform-tools/adb.exe';
const args = process.argv.slice(2);
const run = (...a) => execFileSync(adb, ['-s', 'emulator-5554', ...a], { timeout: 25000, maxBuffer: 16 * 1024 * 1024 });
const pause = () => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 500);
const readNodes = () => {
  run('shell', 'uiautomator', 'dump', '/sdcard/window.xml');
  return [...run('shell', 'cat', '/sdcard/window.xml').toString().matchAll(/<node\s+([^>]+)/g)].map(m => Object.fromEntries([...m[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(a => [a[1], a[2].replace(/&#10;/g, '\n').replace(/&amp;/g, '&')])));
};
const findNode = (label, edit = false) => {
  const candidates = readNodes().filter(n => (n.text === label || n['content-desc'] === label) && (!edit || n.class.includes('EditText')));
  const n = candidates.find(n => n.clickable === 'true') || candidates[0];
  if (!n) throw new Error('Elemento ausente: ' + label);
  const b = n.bounds.match(/\d+/g).map(Number);
  if (b[3] <= b[1]) throw new Error('Elemento fora da tela: ' + label);
  run('shell', 'input', 'tap', String(Math.round((b[0]+b[2])/2)), String(Math.round((b[1]+b[3])/2)));
  pause();
};
switch (args[0]) {
  case 'tap-label': findNode(args[1]); break;
  case 'fill': findNode(args[1], true); run('shell', 'input', 'keycombination', '113', '29'); run('shell', 'input', 'text', args[2]); break;
  case 'status':
    console.log(run('shell', 'getprop', 'sys.boot_completed').toString());
    console.log(run('shell', 'pm', 'list', 'packages', 'host.exp.exponent').toString());
    break;
  case 'snapshot': {
    pause();
    const name = (args[1] || 'screen').replace(/[^a-z0-9-]/gi, '');
    fs.writeFileSync(path.join(__dirname, name + '.png'), run('exec-out', 'screencap', '-p'));
    run('shell', 'uiautomator', 'dump', '/sdcard/window.xml');
    const xml = run('shell', 'cat', '/sdcard/window.xml').toString();
    fs.writeFileSync(path.join(__dirname, name + '.xml'), xml);
    console.log(xml.replace(/></g, '>\n<').split('\n').filter(l => /text="[^"]+"|content-desc="[^"]+"|EditText/.test(l)).map(l => [...l.matchAll(/(?:text|content-desc|bounds|focused|enabled|class)="([^"]*)"/g)].map(m=>m[0]).join(' ')).join('\n'));
    break;
  }
  case 'tap': console.log(run('shell', 'input', 'tap', args[1], args[2]).toString()); break;
  case 'text': console.log(run('shell', 'input', 'text', args[1]).toString()); break;
  case 'key': console.log(run('shell', 'input', 'keyevent', args[1]).toString()); break;
  case 'swipe': console.log(run('shell', 'input', 'swipe', ...args.slice(1)).toString()); break;
  case 'logs': console.log(run('logcat', '-d', '-t', '500', 'ReactNativeJS:V', 'AndroidRuntime:E', '*:S').toString()); break;
  case 'crashes': console.log(run('logcat', '-d', '-b', 'crash').toString().split('\n').filter(l => /host.exp|FATAL EXCEPTION|AndroidRuntime/.test(l)).join('\n')); break;
  case 'open': console.log(run('shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', 'exp://127.0.0.1:8082').toString()); break;
  case 'reverse': console.log(run('reverse', 'tcp:8082', 'tcp:8082').toString()); break;
  default: throw new Error('Ação de QA desconhecida.');
}
