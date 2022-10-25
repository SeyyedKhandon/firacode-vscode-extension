import * as vscode from "vscode";
import {
  deactivateFiraCode,
  firaCodeActivation,
  firstTimeActivation
} from "./util";

export async function activate(context: vscode.ExtensionContext) {
  console.log(
    `Congratulations, your extension "${context.extension.packageJSON.displayName}" installed!`
  );

  firstTimeActivation(context);

  let activateCommand = vscode.commands.registerCommand(
    "firacode.activate",
    () => firaCodeActivation(context)
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
