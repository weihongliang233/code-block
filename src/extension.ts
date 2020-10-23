/* eslint-disable eqeqeq */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ProcessLineNumberArray, Interval } from './mathematics';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	var isBlockState = 1;

	const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

	const DecideState = () => {
		if (isBlockState % 2 == 0) {
			myStatusBarItem.text = "Block Enabled";
			myStatusBarItem.show();
			return true; //偶数
		}
		else {
			myStatusBarItem.text = "Block Unabled";
			myStatusBarItem.show();
			return false; //奇数
		}
	};

	const ChangeState = () => {
		isBlockState++;
		DecideState();
	};


	// 分割整个activeEditor的内容（按行），然后逐行执行匹配，从而获得行号
	//const editor = vscode.window.activeTextEditor;

	//这里我试图逃避类型检查，因为我不知道如何强制告诉ts regstring不会为undefined.
	var regstring: any = vscode.workspace.getConfiguration("code-block").get("regularexpression");

	//var reg = /^\s*%+\*+%+\s*$/;
	var reg:RegExp;
	const changeReg = () => {
		if (regstring) {
			 reg = new RegExp(regstring);
		}
		else {
			 reg = /^\s*%+\*+%+\s*$/;
		}
		vscode.window.showInformationMessage("The Regular Expression has changed");
	};
	//监听changeReg函数，使得每次修改settings.json它都会立刻生效。
	changeReg();
	vscode.workspace.onDidChangeConfiguration(changeReg);

	const getLineNumbers = (editor: vscode.TextEditor) => {


		var text = editor.document.getText();
		var reshapedText = text.split("\n");
		var Length = reshapedText.length;
		var count = [];
		for (let index = 0; index < reshapedText.length; index++) {
			var element = reshapedText[index];
			if (reg.test(element)) {
				count.push(index);
			}
		}
		return { count, Length };

	};



	//接下来实现高亮当前单元格

	//这一段用来实现颜色的实时改变。
	var color: any = vscode.workspace.getConfiguration("code-block").get("color");
	if (color === undefined) {
		color = "#ac72dba8";
	}
	var decorationType = vscode.window.createTextEditorDecorationType({
		backgroundColor: color,
		isWholeLine: true
	});

	var doNothingDecorationType = vscode.window.createTextEditorDecorationType({
		isWholeLine: true,
		backgroundColor: ""
	});

	const changeColor=()=>{
		color=vscode.workspace.getConfiguration("code-block").get("color");
		if (color === undefined) {
			color = "#ac72dba8";
		}
		decorationType = vscode.window.createTextEditorDecorationType({
			backgroundColor: color,
			isWholeLine: true
		});
		doNothingDecorationType = vscode.window.createTextEditorDecorationType({
			isWholeLine: true,
			backgroundColor: ""
		});
		
	};

	vscode.workspace.onDidChangeConfiguration(changeColor);

	//实现完了实时改变颜色的功能

	const highLightCurrentBlock = () => {

		let editor = vscode.window.activeTextEditor;
		if (editor) {
			var getLineObject = getLineNumbers(editor);
			var array = getLineObject.count;
			ProcessLineNumberArray(array, getLineObject.Length);
			let cursor = editor.selection.active;
			let interval = Interval(array, cursor.line);
			let position1 = new vscode.Position(interval[0], 0);
			let position2 = new vscode.Position(interval[1], 0);
			let range = new vscode.Range(position1, position2);
			let decorationsArray: vscode.DecorationOptions[] = [];
			let decoration = { range };
			decorationsArray.push(decoration);
			//editor.setDecorations(decorationType,decorationsArray)
			if (DecideState() == true) {
				if (interval[0] == interval[1]) {
					//分类讨论 因为如果代码格只有1格的话，也会返回相等
					if (array.indexOf(interval[0]) > -1) {
						editor.setDecorations(decorationType, []);
						editor.setDecorations(doNothingDecorationType, decorationsArray);
					}
					else {
						editor.setDecorations(decorationType, decorationsArray);
						editor.setDecorations(doNothingDecorationType, []);
					}
				}
				else {
					editor.setDecorations(decorationType, decorationsArray);
					editor.setDecorations(doNothingDecorationType, []);
				}
			}
			else {
				editor.setDecorations(decorationType, []);
				editor.setDecorations(doNothingDecorationType, []);
			}
		}

	};
	// 接下来监听选择改变
	vscode.window.onDidChangeTextEditorSelection(highLightCurrentBlock);

	//以上代码都还没有考虑激活问题，后续加上去应该不难

	//以下来实现快速在单元格之间导航的内容，分为两部分，经过查找，VScode好像没有直接监听按键行为的api
	const navigateThroughBlocksDown = () => {
		if (DecideState() == true) {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				var getLineObject = getLineNumbers(editor);
				var array = getLineObject.count;
				ProcessLineNumberArray(array, getLineObject.Length);
				let cursor = editor.selection.active;
				let interval = Interval(array, cursor.line);

				//editor.setDecorations(decorationType,decorationsArray)
				if (interval[0] == interval[1]) {
					//分类讨论 因为如果代码格只有1格的话，也会返回相等
					if (array.indexOf(interval[0]) > -1) {
						if (interval[0] == array[array.length - 1]) {
							//如果是最后一行的分隔符，那么什么也不做
						}
						else {
							//如果不是最后一行,那么往下一格首行移动
							let newPosition = new vscode.Position(interval[1] + 2, 0);
							let newSelection = new vscode.Selection(newPosition, newPosition);
							editor.selection = newSelection;
						}
					}
					else {
						//如果是那种单行格子，那么处理方式和其它单元格一样
						if (interval[1] == array[array.length]) {
							//如果单元格是最后一格的话，那么什么也不做
						}
						else {
							//如果还不是最后一格，那么就去到下边界的下一格
							let newPosition = new vscode.Position(interval[1] + 2, 0);
							let newSelection = new vscode.Selection(newPosition, newPosition);
							editor.selection = newSelection;
						}
					}
				}
				else {
					//以下，光标肯定处于单元格
					if (interval[1] == array[array.length]) {
						//如果单元格是最后一格的话，那么什么也不做
					}
					else {
						//如果还不是最后一格，那么就去到下边界的下一格
						let newPosition = new vscode.Position(interval[1] + 2, 0);
						let newSelection = new vscode.Selection(newPosition, newPosition);
						editor.selection = newSelection;
					}
				}
			}
			//vscode.window.showInformationMessage("Down已经激活")
		}
		else {
			// do nothing
		}
	};

	const navigateThroughBlocksUp = () => {
		if (DecideState() == true) {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				var getLineObject = getLineNumbers(editor);
				var array = getLineObject.count;
				ProcessLineNumberArray(array, getLineObject.Length);
				let cursor = editor.selection.active;
				let interval = Interval(array, cursor.line);
				if (interval[0] == 0) {
					//什么也不做,因为处于第一段
				}
				else {
					if (interval[0] == interval[1]) {
						if (array.indexOf(interval[0]) > -1) {
							//如果是分隔符,往上一格末行
							let newPosition = new vscode.Position(interval[0] - 2, 0);
							let newSelection = new vscode.Selection(newPosition, newPosition);
							editor.selection = newSelection;
						}
						else {
							//如果不是分隔符，那么当做单元格来处理,去到上一格的末行
							let newPosition = new vscode.Position(interval[0] - 2, 0);
							let newSelection = new vscode.Selection(newPosition, newPosition);
							editor.selection = newSelection;
						}
					}
					else {
						//此时肯定在单元格之中
						let newPosition = new vscode.Position(interval[0] - 2, 0);
						let newSelection = new vscode.Selection(newPosition, newPosition);
						editor.selection = newSelection;
					}
				}
			}
		}
	};
	//以下来实现选择，仿照高亮；但是有所不同，因为这里没法设置whole line，所以我会将前后注释也包括进去
	//这是bullshit
	const selectCurrentBlock = () => {

		let editor = vscode.window.activeTextEditor;
		if (editor) {
			var getLineObject = getLineNumbers(editor);
			var array = getLineObject.count;
			ProcessLineNumberArray(array, getLineObject.Length);
			let cursor = editor.selection.active;
			let interval = Interval(array, cursor.line);
			//editor.setDecorations(decorationType,decorationsArray)
			//这里就不判断是否处于enabled状态了
			if (interval[0] == interval[1]) {
				//分类讨论 因为如果代码格只有1格的话，也会返回相等
				if (array.indexOf(interval[0]) > -1) {
					//什么也不做
				}
				else {
					//首先定义这一行的首位
					let position1 = new vscode.Position(interval[0], 0);
					//然后找到末尾
					let finalCharacter = editor.document.lineAt(cursor).text.length;
					let position2 = new vscode.Position(interval[0], finalCharacter);
					let newSelection = new vscode.Selection(position1, position2);
					editor.selection = newSelection;
				}
			}
			else {
				//这里可以直接模仿上面的定义
				let position1 = new vscode.Position(interval[0], 0);
				//然后找到末尾
				let finalCharacter = editor.document.lineAt(cursor).text.length;
				let position2 = new vscode.Position(interval[1], finalCharacter);
				let newSelection = new vscode.Selection(position1, position2);
				editor.selection = newSelection;
			}


		}

	};

	//  以下是注册命令的部分

	const registerChangeState = vscode.commands.registerCommand("code-block.ChangeState", ChangeState);
	context.subscriptions.push(registerChangeState);

	const registernavigateThroughBlocksDown = vscode.commands.registerCommand("code-block.navigateThroughBlocksDown", navigateThroughBlocksDown);
	context.subscriptions.push(registernavigateThroughBlocksDown);

	const registernavigateThroughBlocksUp = vscode.commands.registerCommand("code-block.navigateThroughBlocksUp", navigateThroughBlocksUp);
	context.subscriptions.push(registernavigateThroughBlocksUp);

	const registerselectCurrentBlock = vscode.commands.registerCommand("code-block.selectCurrentBlock", selectCurrentBlock);
	context.subscriptions.push(registerselectCurrentBlock);


}

// this method is called when your extension is deactivated
export function deactivate() { }
