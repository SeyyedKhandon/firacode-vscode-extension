import path = require("path");
import * as vscode from "vscode";
import { defaultSettings, GeneralObject } from "./defaultSettings";
const showDialog = vscode.window.showInformationMessage;

const firacodePath = (context: vscode.ExtensionContext) =>
  path.resolve(context.extensionPath, "firaCodeFont");

const updateUserSettings = (settings: GeneralObject, remove = false) =>
  Object.entries(settings).forEach(([key, value]) =>
    vscode.workspace
      .getConfiguration()
      .update(
        key,
        remove ? undefined : value,
        vscode.ConfigurationTarget.Global
      )
  );

export function dirOpen(dirPath: string) {
  let command = "";
  switch (process.platform) {
    case "darwin":
      command = "open";
      break;
    case "win32":
      command = "explorer";
      break;
    default:
      command = "xdg-open";
      break;
  }
  return require("child_process").exec(`${command} ${dirPath}`);
}

export function firaCodeActivation(context: vscode.ExtensionContext) {
  const firacodeAddress = firacodePath(context);
  updateUserSettings(defaultSettings);
  dirOpen(firacodeAddress);
  showDialog(
    `Important Note - Font configurations have been updated, Font Directory will open, and once you have manually installed fonts, restart VSCODE. ${firacodeAddress}`
  );
}

export const firaCodeActivationPrompt = (context: vscode.ExtensionContext) =>
  showDialog("Activate FiraCode?", "Yes", "No").then((value) =>
    value === "Yes"
      ? firaCodeActivation(context)
      : (showDialog(
          "You can activate FiraCode later by running 'firacode' in command palette."
        ) as any)
  );

export function firstTimeActivation(context: vscode.ExtensionContext) {
  const version = context.extension.packageJSON.version ?? "1.0.0";
  const previousVersion = context.globalState.get(context.extension.id);
  if (previousVersion === version) return;

  firaCodeActivationPrompt(context);
  context.globalState.update(context.extension.id, version);
}

export function deactivateFiraCode(context: vscode.ExtensionContext) {
  // context.globalState.update(context.extension.id, undefined);
  updateUserSettings(defaultSettings, true);
  showDialog("FiraCode Font is deactivated!");
}
