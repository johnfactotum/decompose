#!/usr/bin/gjs
imports.gi.versions.Gtk = '4.0'
const { Gtk, Gio, GLib, Adw } = imports.gi
const { programInvocationName } = imports.system
GLib.set_prgname('com.github.johnfactotum.Decompose')
GLib.set_application_name('Decompose')

const path = '/usr/share/X11/locale/en_US.UTF-8/Compose'
const file = Gio.File.new_for_path(path)
const [success, data] = file.load_contents(null)
if (!success) throw new Error(`Could not read ${path}`)
const text = new TextDecoder().decode(data)
const map = new Map()
for (const line of text.split('\n')) {
    const l = line.split('#')[0]
    const char = l.match(/"(\S+)"/)?.[1]
    if (!char) continue
    const key = l.split(':')[0].trim()
    if (key.startsWith('<Multi_key>'))
         map.get(char)?.push(key) ?? map.set(char, [key])
}

const getCodePoint = text => Array.from(text, str => {
    const n = str.codePointAt(0)
    return n >= 32 && n <= 126 ? `<${str}>` :`u+${n.toString(16).padStart(4, '0')}`
}).join(' ')

const application = new Adw.Application({
    application_id: 'com.github.johnfactotum.Decompose',
    flags: Gio.ApplicationFlags.FLAGS_NONE,
})
application.connect('activate', ({ activeWindow }) => {
    if (activeWindow) {
        activeWindow.present()
        return
    }
    const content = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL })
    const header = new Adw.HeaderBar()
    const entry = new Gtk.SearchEntry({
        placeholderText: 'Paste or type a character',
        marginStart: 12, marginEnd: 12, marginTop: 12, marginBottom: 6 })
    const precomp = new Gtk.CheckButton({
        label: 'Prefer precomposed characters', active: true,
        marginStart: 12, marginEnd: 12 })
    const noVS = new Gtk.CheckButton({
        label: 'Ignore variation selectors', active: true,
        marginStart: 12, marginEnd: 12, marginBottom: 12 })
    const sep = new Gtk.Separator({ visible: false, marginBottom: 12 })
    const label = new Gtk.Label({
        selectable: true, wrap: true, xalign: 0, visible: false,
        marginStart: 12, marginEnd: 12, marginBottom: 12 })
    label.add_css_class('monospace')
    const update = () => {
        const text = entry.text.trim().normalize(precomp.active ? 'NFC' : 'NFD')
        const text_ = noVS.active ? text.replace(/\p{VS}/u, '') : text
        label.label = text_ ? map.get(text_)?.join('\n') ?? getCodePoint(text_) : ''
        label.visible = sep.visible = !!label.label
    }
    entry.connect('changed', update)
    precomp.connect('toggled', update)
    noVS.connect('toggled', update)
    content.append(header)
    content.append(entry)
    content.append(precomp)
    content.append(noVS)
    content.append(sep)
    content.append(label)
    new Adw.ApplicationWindow({
        application, content, defaultWidth: 360, resizable: false }).present()
})
application.run([programInvocationName, ...ARGV])
