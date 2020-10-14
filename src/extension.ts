// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	var isBlockState = 1;

	const myStatusBarItem=vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

	const DecideState = () => {
		if (isBlockState % 2 == 0) {
			myStatusBarItem.text="处于激活状态";
			myStatusBarItem.show();
			return true; //偶数
		}
		else {
			myStatusBarItem.text="处于非激活状态";
			myStatusBarItem.show();
			return false; //奇数
		}
	}

	const ChangeState = () => {
		isBlockState++;
		DecideState()
	}


	const test=()=>{
		myStatusBarItem.text="激活状态";
		myStatusBarItem.show();
		vscode.window.showInformationMessage("已经执行")
	}

	//  以下是注册命令的部分
	const registerTest=vscode.commands.registerCommand("code-block.Test",test)
	context.subscriptions.push(registerTest)

	const registerChangeState=vscode.commands.registerCommand("code-block.ChangeState",ChangeState);
	context.subscriptions.push(registerChangeState)


}

// this method is called when your extension is deactivated
export function deactivate() { }
