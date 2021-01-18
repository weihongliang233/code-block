/* eslint-disable eqeqeq */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { ProcessLineNumberArray, Interval } from "./mathematics";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	var isBlockState = 1;

	const myStatusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100
	);

	//	通过奇偶数来判断用户是否需要高亮当前单元格。 设置ChangeState,将它和一个快捷键绑定起来，每当用户按下快捷键的时候，就改变一次状态，状态分为奇偶，分别代表不激活和激活。
	const DecideState = () => {
		if (isBlockState % 2 == 0) {
			myStatusBarItem.text = "Block Enabled";
			myStatusBarItem.show();
			return true;
		} else {
			myStatusBarItem.text = "Block Unabled";
			myStatusBarItem.show();
			return false;
		}
	};

	const ChangeState = () => {
		isBlockState++;
		DecideState();
	};

	//以下来读取正则表达式
	/*
	要有如下几个功能点：
	1.在settings.json文件里面可以配置多种语言的正则表达式。当编辑器语言发生改变时，正则表达式会自动改变。为此需要用到onDidOpenTextDocument这个事件，在语言发生改变它会被激活。
	2.需要onDidChangeConfiguration来监听settings.json的改变。
	*/
	var reg: RegExp;
	var defaultStrList = [
		"matlab:^\\s*%+\\*+%+\\s*$",
		"wolfram:\\(\\*\\s\\s\\*\\)",
	];
	var dic: any;

	const changeReg = () => {
		let regStrList: string[] | undefined = vscode.workspace
		.getConfiguration("code-block")
		.get("regularexpression");
		if(!regStrList){
			regStrList=defaultStrList;
			vscode.window.showInformationMessage("You havn't specify the regular expression delimiters, the defalut rules will be used");
		}
		dic = {};
		for (let str of regStrList) {
			let language = str.split(":", 1)[0];
			let reg = str.substring(language.length+1, str.length +1);
			dic[language] = reg;
		}
		let editor = vscode.window.activeTextEditor;
		if (editor) {
			reg = new RegExp(dic[editor.document.languageId]);
			if (!reg){
				reg=new RegExp("");
				vscode.window.showInformationMessage("You havn't specify the regular expression delimiter for the language currently used. By default, \"\" will be used");
			}
		} else {
			vscode.window.showInformationMessage("Please open a file before using the code-block extension");
		}
	};

	//监听changeReg函数，使得每次修改settings.json它都会立刻生效。
	changeReg();
	vscode.window.onDidChangeActiveTextEditor(changeReg);
	vscode.workspace.onDidChangeConfiguration(changeReg);
	vscode.workspace.onDidOpenTextDocument(changeReg);

	//这个函数用来得到分割符号的位置，提供给后续处理
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
		//count存储所有分隔符的位置，Length存储总行数
	};

	//接下来实现高亮当前单元格

	//这一段用来实现颜色的实时改变。
	var color: any = vscode.workspace.getConfiguration("code-block").get("color");
	if (color === undefined) {
		color = "#ac72dba8";
	}
	var decorationType = vscode.window.createTextEditorDecorationType({
		backgroundColor: color,
		isWholeLine: true,
	});

	var doNothingDecorationType = vscode.window.createTextEditorDecorationType({
		isWholeLine: true,
		backgroundColor: "",
	});

	const changeColor = () => {
		color = vscode.workspace.getConfiguration("code-block").get("color");
		if (color === undefined) {
			color = "#ac72dba8";
		}
		decorationType = vscode.window.createTextEditorDecorationType({
			backgroundColor: color,
			isWholeLine: true,
		});
		doNothingDecorationType = vscode.window.createTextEditorDecorationType({
			isWholeLine: true,
			backgroundColor: "",
		});
	};

	vscode.workspace.onDidChangeConfiguration(changeColor);

	//实现完了实时改变颜色的功能

	//接下来这一段用来实现高亮单元格

	//从这里开始的许多核心函数都依赖于一些数学处理： 当前光标在哪个区间里？ 每个区间的上下界限在哪里？ 所以我写了一个同目录的mathematica.ts，提供了函数来处理这些数学问题。在继续往下阅读之前请先阅读那个文件。
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
						//这里的indexOf可能会造成疑惑。用这个条件实际上是在判断光标的位置是否是任何一个分隔符的所在行，如果是的话就返回True。
						editor.setDecorations(decorationType, []);
						editor.setDecorations(doNothingDecorationType, decorationsArray);
					} else {
						editor.setDecorations(decorationType, decorationsArray);
						editor.setDecorations(doNothingDecorationType, []);
					}
				} else {
					editor.setDecorations(decorationType, decorationsArray);
					editor.setDecorations(doNothingDecorationType, []);
				}
			}
			//如果DecideState是处于不激活状态的话，那么需要抹除之前的装饰，如果不抹除的话它就会留在那里
			else {
				editor.setDecorations(decorationType, []);
				editor.setDecorations(doNothingDecorationType, []);
			}
		}
	};
	// 接下来监听鼠标位置的改变
	vscode.window.onDidChangeTextEditorSelection(highLightCurrentBlock);

	//以下来实现快速在单元格之间移动的问题
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
						} else {
							//如果不是最后一行,那么往下一格首行移动
							let newPosition = new vscode.Position(interval[1] + 2, 0);
							let newSelection = new vscode.Selection(newPosition, newPosition);
							editor.selection = newSelection;
						}
					} else {
						//如果是那种单行格子，那么处理方式和其它单元格一样
						if (interval[1] == array[array.length]) {
							//如果单元格是最后一格的话，那么什么也不做
						} else {
							//如果还不是最后一格，那么就去到下边界的下一格
							let newPosition = new vscode.Position(interval[1] + 2, 0);
							let newSelection = new vscode.Selection(newPosition, newPosition);
							editor.selection = newSelection;
						}
					}
				} else {
					//以下，光标肯定处于单元格
					if (interval[1] == array[array.length]) {
						//如果单元格是最后一格的话，那么什么也不做
					} else {
						//如果还不是最后一格，那么就去到下边界的下一格
						let newPosition = new vscode.Position(interval[1] + 2, 0);
						let newSelection = new vscode.Selection(newPosition, newPosition);
						editor.selection = newSelection;
					}
				}
			}
			//vscode.window.showInformationMessage("Down已经激活")
		} else {
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
				} else {
					if (interval[0] == interval[1]) {
						if (array.indexOf(interval[0]) > -1) {
							//如果是分隔符,往上一格末行
							let newPosition = new vscode.Position(interval[0] - 2, 0);
							let newSelection = new vscode.Selection(newPosition, newPosition);
							editor.selection = newSelection;
						} else {
							//如果不是分隔符，那么当做单元格来处理,去到上一格的末行
							let newPosition = new vscode.Position(interval[0] - 2, 0);
							let newSelection = new vscode.Selection(newPosition, newPosition);
							editor.selection = newSelection;
						}
					} else {
						//此时肯定在单元格之中
						let newPosition = new vscode.Position(interval[0] - 2, 0);
						let newSelection = new vscode.Selection(newPosition, newPosition);
						editor.selection = newSelection;
					}
				}
			}
		}
	};

	const selectCurrentBlock = () => {
		let editor = vscode.window.activeTextEditor;
		if (editor) {
			var getLineObject = getLineNumbers(editor);
			var array = getLineObject.count;
			ProcessLineNumberArray(array, getLineObject.Length);
			let cursor = editor.selection.active;
			let interval = Interval(array, cursor.line);
			//editor.setDecorations(decorationType,decorationsArray)
			//这里就不判断是否处于enabled状态了`
			if (interval[0] == interval[1]) {
				//分类讨论 因为如果代码格只有1格的话，也会返回相等
				if (array.indexOf(interval[0]) > -1) {
					//什么也不做
				} else {
					//首先定义这一行的首位
					let position1 = new vscode.Position(interval[0], 0);
					//然后找到末尾
					let finalCharacter = editor.document.lineAt(
						new vscode.Position(interval[1], 0)
					).text.length;
					let position2 = new vscode.Position(interval[1], finalCharacter);
					let newSelection = new vscode.Selection(position1, position2);
					editor.selection = newSelection;
				}
			} else {
				//可以模仿上面的定义
				let position1 = new vscode.Position(interval[0], 0);
				//然后找到末尾
				let finalCharacter = editor.document.lineAt(
					new vscode.Position(interval[1], 0)
				).text.length;
				let position2 = new vscode.Position(interval[1], finalCharacter);
				let newSelection = new vscode.Selection(position1, position2);
				editor.selection = newSelection;
			}
		}
	};

	//  以下是注册命令的部分
	const registerChangeState = vscode.commands.registerCommand(
		"code-block.ChangeState",
		ChangeState
	);
	context.subscriptions.push(registerChangeState);

	const registernavigateThroughBlocksDown = vscode.commands.registerCommand(
		"code-block.navigateThroughBlocksDown",
		navigateThroughBlocksDown
	);
	context.subscriptions.push(registernavigateThroughBlocksDown);

	const registernavigateThroughBlocksUp = vscode.commands.registerCommand(
		"code-block.navigateThroughBlocksUp",
		navigateThroughBlocksUp
	);
	context.subscriptions.push(registernavigateThroughBlocksUp);

	const registerselectCurrentBlock = vscode.commands.registerCommand(
		"code-block.selectCurrentBlock",
		selectCurrentBlock
	);
	context.subscriptions.push(registerselectCurrentBlock);
}

// this method is called when your extension is deactivated
export function deactivate() { }
