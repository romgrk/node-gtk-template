/*
 * application.js
 */

const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const gi = require('node-gtk')
const Gtk = gi.require('Gtk', '4.0')
const Gdk = gi.require('Gdk', '4.0')
const GLib = gi.require('GLib', '2.0')

const Window = require('./window')

let cssProvider
let styleFileWatcher
let _stylesheetPath
let _onDidShow

class Application extends Gtk.Application {
  constructor(stylesheetPath, callback) {
    super('com.github.romgrk.xedel', 0)
    _onDidShow = callback
    _stylesheetPath = stylesheetPath
    this.on('activate', () => this.onActivate())
  }

  onActivate() {
    cssProvider = new Gtk.CssProvider()
    Gtk.StyleContext.addProviderForDisplay(
      Gdk.Display.getDefault(),
      cssProvider,
      9999
    )

    const mainWindow = new Window(this)
    mainWindow.on('close-request', () => {
      this.loop.quit()
      process.exit(0)
    })
    mainWindow.on('show', () => {
      initializeStyle(_stylesheetPath)
      _onDidShow(mainWindow)
    })
    mainWindow.show()

    gi.startLoop()
    this.loop = GLib.MainLoop.new(null, false)
    this.loop.run()
  }

  exit() {
    if (styleFileWatcher) {
      styleFileWatcher.close()
      styleFileWatcher = null
    }
  }
}

function initializeStyle(stylesheetPath) {
  const reloadStyles = (filename, stats) => {
    const buffer = fs.readFileSync(stylesheetPath)
    cssProvider.loadFromData(buffer, buffer.length)
    console.log('Stylesheet loaded')
  }

  if (process.env.NODE_ENV !== 'production') {
    styleFileWatcher = chokidar.watch(stylesheetPath)
    styleFileWatcher.on('change', reloadStyles)
  }

  reloadStyles()
}


module.exports = Application
