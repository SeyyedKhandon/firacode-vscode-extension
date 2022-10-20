import * as vscode from "vscode";
import { defaultSettings, GeneralObject } from "./defaultSettings";
// import getSystemFonts from "get-system-fonts";
const installfont = require("installfont");
const showDialog = vscode.window.showInformationMessage;

const updateUserSettings = async (settings: GeneralObject) => {
  Object.entries(settings).forEach(async ([key, value]) => {
    await vscode.workspace
      .getConfiguration()
      .update(key, value, vscode.ConfigurationTarget.Global);
  });
};
const installFiraCodeFont = async (address: string) => {
  installfont(address, function (err: any) {
    if (err) {
      showDialog(err.toString());
      require("child_process").exec(`start "" ${address}`);
      return showDialog("Reload VSCODE after manually installing fonts!");
    }
    showDialog(
      "FiraCode fonts have been successfully installed. VScode must be closed and reopened in order to take effect!"
    );
  });
};
// const isFiraCodeInstalled = async () => {
//   const systemFonts = (await getSystemFonts()).filter((font) =>
//     font.toLowerCase().includes("firacode")
//   );
//   return !!systemFonts.length;
// };

export async function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "FiraCode Font" is now active!');
  let disposable = vscode.commands.registerCommand(
    "firacode.install",
    async () => {
      await updateUserSettings(defaultSettings);
      showDialog("FiraCode Config has been updated.");
      // if (!(await isFiraCodeInstalled()))
      installFiraCodeFont(context.extensionPath + "/firaCodeFont");
    }
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
