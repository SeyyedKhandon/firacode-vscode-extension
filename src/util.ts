import * as vscode from "vscode";
import { defaultSettings, GeneralObject } from "./defaultSettings";
const showDialog = vscode.window.showInformationMessage;

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

export function firaCodeActivation(fontAddress: string) {
  updateUserSettings(defaultSettings);
  dirOpen(fontAddress);
  showDialog(
    `Important Note - Font configurations have been updated. Font Directory will open, and once you have manually installed fonts, restart VSCODE. ${fontAddress}`
  );
}

export const firaCodeActivationPrompt = (fontAddress: string) =>
  showDialog("Activate FiraCode?", "Yes", "No").then((value) =>
    value === "Yes"
      ? firaCodeActivation(fontAddress)
      : (showDialog(
          "You can activate FiraCode later by running 'firacode' in command palette."
        ) as any)
  );

export function firstTimeActivation(
  context: vscode.ExtensionContext,
  fontAddress: string
) {
  const firacodeExt = vscode.extensions.getExtension("SeyyedKhandon.firacode");
  const version = firacodeExt?.packageJSON.version ?? "1.0.0";
  const previousVersion = context.globalState.get("FiraCodeVersion");
  if (previousVersion === version) return;

  firaCodeActivationPrompt(fontAddress);
  context.globalState.update("FiraCodeVersion", version);
}

export function deactivateFiraCode(context: vscode.ExtensionContext) {
  context.globalState.update("FiraCodeVersion", "");
  updateUserSettings(defaultSettings, true);
  showDialog("FiraCode Font is deactivated!");
}
