#!/usr/bin/env node

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Save as Workspace
// @raycast.mode silent

// Optional parameters:
// @raycast.icon assets/icon.png
// @raycast.packageName Workspaces
// @raycast.argument1 { "type": "text", "placeholder": "Workspace Name" }

// Documentation:
// @raycast.description Save the current window layout as new commands
// @raycast.author Nichlas Wærnes Andersen
// @raycast.authorURL https://github.com/itsnwa

import fs from "fs"
import { windowManager } from "node-window-manager"
import slugify from "@sindresorhus/slugify"
import { excludedTitles } from "./excludedTitles.js"

windowManager.requestAccessibility()
const openWindows = windowManager.getWindows()
const [workspaceName] = process.argv.slice(2)

// Create new window object with only the properties we need
// and filter out some apps that we don't want to save

const windows = openWindows.reduce((acc, window) => {
  const title = window.getTitle().toLowerCase()
  if (!excludedTitles.includes(title)) {
    acc.push({
      id: window.id,
      processId: window.processId,
      title: window.getTitle(),
      bounds: window.getBounds(),
      path: window.path
    })
  }
  return acc
}, [])

// Create a new workspace script
const script = `#!/usr/bin/env node
// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title ${workspaceName}
// @raycast.mode silent
// @raycast.packageName Workspaces
//
// Optional parameters:
// @raycast.icon assets/icon.png
//
// Documentation:
// @raycast.description Open ${workspaceName} layout workspace
// @raycast.author Nichlas W. Andersen
// @raycast.authorURL https://github.com/itsnwa

import { execSync } from "child_process"
import { windowManager } from "node-window-manager"

const windows = ${JSON.stringify(windows)}

// Hide all windows that are not in the saved workspace
windowManager.getWindows().forEach((window) => {
  if (!windows.find((w) => w.title === window.getTitle())) {
    execSync(\`osascript -e 'tell application "System Events" to set visible of process "\${window.getTitle()}" to false'\`)
  }
})

// Open the saved windows
windows.forEach((window) => {
  // Check if app is open
  let app = windowManager.getWindows().find((w) => w.getTitle() === window.title)
  if (app) {
    app.setBounds(window.bounds)
  } else {
    // Launch the app
    execSync(\`open -a "\${window.path}"\`)

    // Wait for the app to launch and its window to appear
    const waitForApp = setInterval(() => {
      app = windowManager.getWindows().find((w) => w.getTitle() === window.title)

      if (app) {
        clearInterval(waitForApp) // Stop waiting once the app is found
        app.setBounds(window.bounds) // Set the window position and size
      }H

    }, 300) // Check every 0.3 seconds
  }
})
`

// Write script to disk
fs.writeFileSync(`workspace-${slugify(workspaceName)}.js`, script)
