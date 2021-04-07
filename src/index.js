const fs = require('fs')
const path = require('path')
const gi = require('node-gtk')
const Gtk = gi.require('Gtk', '4.0')
const Gdk = gi.require('Gdk', '4.0')
// Required if running under X11
const GdkX11 = gi.require('GdkX11', '4.0')
const Application = require('./application')

/* Constants */

const STYLESHEET_PATH = path.join(__dirname, './style.css')

/* Initialization */

Gtk.init([])

let app

function main() {
  app = new Application(STYLESHEET_PATH, () => {
    // Application activated handler
    // Add your application activation logic here.
    // IMPORTANT: Do not run any promises or async code before this is called.
  })
  app.run()
}

function onExit() {
  if (onExit.didExit)
    return
  onExit.didExit = true
  app.exit()
  console.log('Exiting gracefully...')
}

process.on('exit',    onExit)
process.on('SIGTERM', onExit)
process.on('SIGHUP',  onExit)

main()
