#!/Users/nichlas/.nvm/versions/node/v21.4.0/bin/node
// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Front-end Development
// @raycast.mode silent
// @raycast.packageName Workspaces
//
// Optional parameters:
// @raycast.icon assets/icon.png
//
// Documentation:
// @raycast.description Open test layout workspace
// @raycast.author Nichlas W. Andersen
// @raycast.authorURL https://github.com/itsnwa

import { execSync } from "child_process"
import { windowManager } from "node-window-manager"

const windows = [{"id":41,"processId":1529,"title":"Dock","bounds":{"x":0,"y":0,"width":2560,"height":1440},"path":"/System/Library/CoreServices/Dock.app"},{"id":12545,"processId":59807,"title":"Code","bounds":{"x":32,"y":57,"width":1232,"height":1280},"path":"/Applications/Visual Studio Code.app"},{"id":12556,"processId":59811,"title":"Arc","bounds":{"x":1296,"y":57,"width":1232,"height":741},"path":"/Applications/Arc.app"},{"id":12536,"processId":59809,"title":"iTerm2","bounds":{"x":1298,"y":831,"width":1228,"height":504},"path":"/Applications/iTerm.app"}]

// hide all windows that are not in the workspace
windowManager.getWindows().forEach((window) => {
  if (!windows.find((w) => w.title === window.getTitle())) {
    execSync(`osascript -e 'tell application "System Events" to set visible of process "${window.getTitle()}" to false'`)
    // window.minimize()
  }
})

// Open the saved windows
windows.forEach((window) => {
  // Check if app is open
  let app = windowManager.getWindows().find((w) => w.getTitle() === window.title)
  if (!app) {
    // Launch the app
    execSync(`open -a "${window.path}"`)

    // Wait for the app to launch and its window to appear
    const waitForApp = setInterval(() => {
      app = windowManager.getWindows().find((w) => w.getTitle() === window.title);

      if (app) {
        clearInterval(waitForApp); // Stop waiting once the app is found
        app.setBounds(window.bounds); // Set the window position and size
      }

    }, 300); // Check every 300 milliseconds (0.3 second)
  }
  if (app) {
    app.setBounds(window.bounds)
  }
})
