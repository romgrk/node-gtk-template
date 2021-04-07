/*
 * window.js
 */

const fs = require('fs')
const path = require('path')
const gi = require('node-gtk')
const Gtk = gi.require('Gtk', '4.0')
const Gdk = gi.require('Gdk', '4.0')
const Key = require('./utils/key')

const UI_PATH = path.join(__dirname, 'ui.glade')

class Window extends Gtk.ApplicationWindow {
  constructor(app) {
    super(app)
    this.focusable = false
    this.setTitle('Node-Gtk Application')
    this.setDefaultSize(800, 800)
    this.on('destroy', () => this.onDestroy())

    // Window initialization here

    const ui = fs.readFileSync(UI_PATH).toString()
    const builder = Gtk.Builder.newFromString(ui, ui.length)

    // You can also build your objects manually, eg:
    //   const box = new Gtk.Box()
    //   const button = new Gtk.Button()
    //   box.append(button)
    //   ...
    //   window.setChild(box)

    const mainBox = builder.getObject('mainBox')
    const textView = builder.getObject('textView')
    textView.monospace = true
    // Listening to focus/key-events require a controller
    const keyController = new Gtk.EventControllerKey()
    keyController.on('key-pressed', this.onKeyPressEvent)
    textView.addController(keyController)


    const toolbar = builder.getObject('toolbar')
    toolbar.addCssClass('toolbar')

    const controlBar = builder.getObject('controlBar')
    controlBar.addCssClass('control-bar')

    const controlEntry = builder.getObject('controlEntry')
    const controlButton = builder.getObject('controlButton')
    controlButton.on('clicked', loadFile)
    controlEntry.on('activate', loadFile)
    controlEntry.setText(__filename)

    function loadFile() {
      const filename = controlEntry.getText()
      fs.promises.readFile(filename)
        .then(buffer => {
          textView.getBuffer().setText(buffer, buffer.length)
        })
        .catch(err => {
          textView.getBuffer().setText(err.message, err.message.length)
        })
    }


    this.setChild(mainBox)
  }

  onKeyPressEvent = (keyval, keycode, state) => {
    // Use the Key.fromArg helper to parse the key event
    const key = Key.fromArgs(keyval, keycode, state)
    console.log('key-pressed', key)
  }

  onDestroy() {
    process.exit(0)
  }
}

gi.registerClass(Window)

module.exports = Window
