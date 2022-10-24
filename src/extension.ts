import * as vscode from "vscode";
import path = require("path");
import {
  deactivateFiraCode,
  firaCodeActivation,
  firstTimeActivation
} from "./util";

export async function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "FiraCode Font" installed!');
  const fontAddress = path.resolve(context.extensionPath, "firaCodeFont");
  firstTimeActivation(context, fontAddress);

  let activateCommand = vscode.commands.registerCommand(
    "firacode.activate",
    () => firaCodeActivation(fontAddress)
  );
  let deactivateCommand = vscode.commands.registerCommand(
    "firacode.deactivate",
    () => deactivateFiraCode(context)
  );
  context.subscriptions.push(activateCommand, deactivateCommand);
}

export function deactivate(context: vscode.ExtensionContext) {
  deactivateFiraCode(context);
}
