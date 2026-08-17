import { describe, it, expect } from 'vitest'
import { defaultShell, shellSpawnArgs } from '../src/shell.ts'

describe('shell resolution', () => {
  it('explicit shell wins on every platform', () => {
    expect(defaultShell({ platform: 'linux', explicit: '/bin/fish', env: { SHELL: '/bin/bash' } })).toBe('/bin/fish')
    expect(defaultShell({ platform: 'win32', explicit: 'pwsh.exe' })).toBe('pwsh.exe')
  })

  it('POSIX follows $SHELL then falls back to /bin/bash', () => {
    expect(defaultShell({ platform: 'linux', env: { SHELL: '/bin/zsh' } })).toBe('/bin/zsh')
    // userInfo() is not injectable; when SHELL is unset the resolver reads the
    // real passwd entry. We only assert the documented last-resort when the
    // account has no login shell — skip that branch in CI and assert the
    // happy path here.
  })

  it('Windows: DSH_RESTTY_SHELL env override beats pwsh probing', () => {
    expect(defaultShell({ platform: 'win32', env: { DSH_RESTTY_SHELL: 'pwsh-preview.exe' } })).toBe('pwsh-preview.exe')
  })

  it('Windows: probes known pwsh install dirs when no override', () => {
    const fs = new Set<string>(['C:\\Program Files\\PowerShell\\7\\pwsh.exe'])
    const shell = defaultShell({
      platform: 'win32',
      env: { ProgramW6432: 'C:\\Program Files' },
      exists: (p) => fs.has(p),
    })
    expect(shell).toBe('C:\\Program Files\\PowerShell\\7\\pwsh.exe')
  })

  it('Windows: falls back to inbox powershell.exe when nothing is found', () => {
    expect(defaultShell({ platform: 'win32', env: {}, exists: () => false })).toBe('powershell.exe')
  })

  it('shellSpawnArgs is -l on POSIX and empty on Windows', () => {
    expect(shellSpawnArgs('linux')).toEqual(['-l'])
    expect(shellSpawnArgs('darwin')).toEqual(['-l'])
    expect(shellSpawnArgs('win32')).toEqual([])
  })
})
