/**
 * Keys commonly present in process.env on developer machines / CI that are not app config.
 * Used by runDoctor(..., { undeclaredPolicy: 'ignore-system' }).
 */
const EXACT_IGNORE = new Set(
  [
    'ALLUSERSPROFILE',
    'APPDATA',
    'ANDROID_HOME',
    'ANDROID_SDK_ROOT',
    'ChocolateyInstall',
    'ChocolateyLastPathUpdate',
    'ChocolateyToolsLocation',
    'CHROME_CRASHPAD_PIPE_NAME',
    'COLORTERM',
    'CommonProgramFiles',
    'CommonProgramFiles(x86)',
    'CommonProgramW6432',
    'COMPUTERNAME',
    'ComSpec',
    'CURSOR_TRACE_ID',
    'DOTENV_CONFIG_PATH',
    'DriverData',
    'FPS_BROWSER_APP_PROFILE_STRING',
    'FPS_BROWSER_USER_PROFILE_STRING',
    'GIT_ASKPASS',
    'HOME',
    'HOMEDRIVE',
    'HOMEPATH',
    'INIT_CWD',
    'JAVA_HOME',
    'LANG',
    'LOCALAPPDATA',
    'LOGONSERVER',
    'NODE',
    'NODE_OPTIONS',
    'NODE_PATH',
    'NUMBER_OF_PROCESSORS',
    'OneDrive',
    'OPENSSL_CONF',
    'OS',
    'PATH',
    'Path',
    'PATHEXT',
    'PNPM_HOME',
    'PNPM_SCRIPT_SRC_DIR',
    'PROCESSOR_ARCHITECTURE',
    'PROCESSOR_IDENTIFIER',
    'PROCESSOR_LEVEL',
    'PROCESSOR_REVISION',
    'ProgramData',
    'ProgramFiles',
    'ProgramFiles(x86)',
    'ProgramW6432',
    'PROMPT',
    'PSModulePath',
    'PUBLIC',
    'SESSIONNAME',
    'SystemDrive',
    'SystemRoot',
    'TEMP',
    'TERM_PROGRAM',
    'TERM_PROGRAM_VERSION',
    'TMP',
    'USERDOMAIN',
    'USERDOMAIN_ROAMINGPROFILE',
    'USERNAME',
    'USERPROFILE',
    'VBOX_MSI_INSTALL_PATH',
    'VSCODE_GIT_ASKPASS_MAIN',
    'VSCODE_GIT_ASKPASS_NODE',
    'VSCODE_GIT_IPC_AUTH_TOKEN',
    'VSCODE_GIT_IPC_HANDLE',
    'VSCODE_INJECTION',
    'windir',
    'WINDIR',
    'XDG_SESSION_TYPE',
    'XDG_RUNTIME_DIR',
    'SHELL',
    'SHLVL',
    'SSH_AUTH_SOCK',
    'DISPLAY',
    'TERM',
    'USER',
    'LOGNAME',
    'PWD',
    'OLDPWD',
    'LC_ALL',
    'EDITOR',
    'VISUAL',
  ].map((k) => k),
)

const PREFIXES_IGNORE = [
  'npm_',
  'pnpm_',
  'PNPM_',
  'VSCODE_',
  'GIT_',
  'CHROME_',
  'EFC_',
]

/** Windows-style random env keys like EFC_7452_1262719628 */
const EFC_LIKE = /^efc_\d+_/i

export function isLikelySystemOrToolEnvKey(key: string): boolean {
  if (EXACT_IGNORE.has(key)) return true
  const upper = key.toUpperCase()
  if (EXACT_IGNORE.has(upper)) return true
  const lower = key.toLowerCase()
  for (const p of PREFIXES_IGNORE) {
    if (lower.startsWith(p.toLowerCase())) return true
  }
  if (EFC_LIKE.test(key)) return true
  return false
}
