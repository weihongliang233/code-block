// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ProcessLineNumberArray , Interval} from './mathematics'

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

	var reg = /^\s*%+\*+%+\s*$/


	const getLineNumbers = () => {

		if (editor) {
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
		}
		return { count, Length };
	}

	//接下来处理头尾行，只是编写一个函数

	//接下来我需要考虑文本头尾为匹配行的情况+一般情况

	//这里将变量暴露在功能模块之外，等下修复;;更新：就是要让它暴露在全文之中。并且监听文本改变的事件，文本一旦改变，立刻更新成
	//新的匹配数组

	//并且我这里还没有考虑空文本

	//初始化一组变量
	var getLineObject = getLineNumbers()
	var array = getLineObject.count
	ProcessLineNumberArray(array, getLineObject.Length);

	//定义一个listener函数来监听文本的改变
	const updateLineNumberArray = () => {
		getLineObject = getLineNumbers();
		array = getLineObject.count
		ProcessLineNumberArray(array, getLineObject.Length);
	}
	vscode.window.onDidChangeTextEditorSelection(updateLineNumberArray)

	//接下来实现高亮当前单元格
	const decorationType = vscode.window.createTextEditorDecorationType({
		backgroundColor: "#ac72dba8",
		isWholeLine: true
	})

	const doNothingDecorationType=vscode.window.createTextEditorDecorationType({
		isWholeLine:true,
		backgroundColor:""
	})

	const highLightCurrentBlock = () => {
		let editor = vscode.window.activeTextEditor
		if (editor) {
			let cursor = editor.selection.active;
			let interval=Interval(array,cursor.line);
			let position1=new vscode.Position( interval[0],0);
			let position2=new vscode.Position( interval[1],0);
			let range=new vscode.Range(position1, position2);
			let decorationsArray: vscode.DecorationOptions[] = []
			let decoration={range}
			decorationsArray.push(decoration)
			//editor.setDecorations(decorationType,decorationsArray)
			if (interval[0]==interval[1]) {
				editor.setDecorations(decorationType,[])
				editor.setDecorations(doNothingDecorationType,decorationsArray)
			}
			else{
				editor.setDecorations(decorationType,decorationsArray)
				editor.setDecorations(doNothingDecorationType,[])
			}
		}
	}
	// 接下来监听选择改变
	vscode.window.onDidChangeTextEditorSelection(highLightCurrentBlock)

	//以上代码都还没有考虑激活问题，后续加上去应该不难

	//以下来实现快速在单元格之间导航的内容


	const test = () => {
		let editor=vscode.window.activeTextEditor
		if (editor) {
			let cursor=editor.selection.active
			let num=cursor.line
			let str=num.toString
			vscode.window.showInformationMessage("asdfsd")
		}
	}
	

	//  以下是注册命令的部分
	const registerTest = vscode.commands.registerCommand("code-block.Test", test)
	context.subscriptions.push(registerTest)

	const registerChangeState = vscode.commands.registerCommand("code-block.ChangeState", ChangeState);
	context.subscriptions.push(registerChangeState)


}

// this method is called when your extension is deactivated
export function deactivate() { }
