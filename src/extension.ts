// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {ProcessLineNumberArray} from './mathematics'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	var isBlockState = 1;

	const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

	const DecideState = () => {
		if (isBlockState % 2 == 0) {
			myStatusBarItem.text = "处于激活状态";
			myStatusBarItem.show();
			return true; //偶数
		}
		else {
			myStatusBarItem.text = "处于非激活状态";
			myStatusBarItem.show();
			return false; //奇数
		}
	}

	const ChangeState = () => {
		isBlockState++;
		DecideState()
	}


	// 分割整个activeEditor的内容（按行），然后逐行执行匹配，从而获得行号
	const editor = vscode.window.activeTextEditor;

	var reg = /\s*%+\*+%+\s*/


	const getLineNumbers = () => {

		if (editor) {
			var text = editor.document.getText();
			var reshapedText = text.split("\n");
			var Length = reshapedText.length;
			var count = [];
			for (let index = 0; index < reshapedText.length; index++) {
				var element = reshapedText[index];
				if (element.match(reg)) {
					count.push(index);
				}
			}
		}
		return { count, Length };
	}

	//接下来处理头尾行，只是编写一个函数

	//接下来我需要考虑文本头尾为匹配行的情况+一般情况

	//这里将变量暴露在功能模块之外，等下修复

	//并且我这里还没有考虑空文本
	var getLineObject=getLineNumbers()
	var array=getLineObject.count
	ProcessLineNumberArray(array,getLineObject.Length);

	

	const test = () => {
		var a = getLineNumbers();
		var byte = "15253"
		console.log(byte);
	}

	//  以下是注册命令的部分
	const registerTest = vscode.commands.registerCommand("code-block.Test", test)
	context.subscriptions.push(registerTest)

	const registerChangeState = vscode.commands.registerCommand("code-block.ChangeState", ChangeState);
	context.subscriptions.push(registerChangeState)


}

// this method is called when your extension is deactivated
export function deactivate() { }
