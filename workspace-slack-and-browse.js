#!/usr/bin/env node
// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Slack and Browse
// @raycast.mode silent
// @raycast.packageName Workspaces
//
// Optional parameters:
// @raycast.icon assets/icon.png
//
// Documentation:
// @raycast.description Open Slack and Browse layout workspace
// @raycast.author Nichlas W. Andersen
// @raycast.authorURL https://github.com/itsnwa

import { execSync } from "child_process"
import { windowManager } from "node-window-manager"

const windows = [{"id":13166,"processId":62926,"title":"Slack","bounds":{"x":32,"y":57,"width":1232,"height":1351},"path":"/Applications/Slack.app"},{"id":12858,"processId":61792,"title":"Arc","bounds":{"x":1296,"y":57,"width":1232,"height":1351},"path":"/Applications/Arc.app"}]

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
