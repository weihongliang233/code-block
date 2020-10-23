# code-block README

This is an extension which provide the functionality of splitting the code file into small blocks and manipulate with it (something like Jupyter).

"ctrl+shift+p" and execute the command "Change State" to enable the extension.

## Motion of creating this extension

Interactive programming has becoming a new trend of programming. Mathematica, IPython (Jupyter) and Matlab Live Script are some examples. They have something in common, they all have structures called code cells or I prefer to call it "code blocks". Each time you can run the whole block. To implement such functionality in VScode is quite reasonable. You may argue that there is already good supplements for juyter notebook in VScode. But my point is that we should be able to do it in the original code file. Not `".ipynb"` but just `".py"`. I have participated in a project [vscode-matlab-interactive-terminal](https://github.com/apommel/vscode-matlab-interactive-terminal). It provide the functionality to run selected matlab code in VScode. But there is issues suggesting a new functionality of [Recognize and run code blocks](https://github.com/apommel/vscode-matlab-interactive-terminal/issues/13). I consider it as a common functionality and build this extension to enable people to split the code file into blocks using regular expressions comments. And the full list of features are as follow.

## Features and Usage

- Splitting the code file into blocks with regular expression. By now I use the MATLAB comment `%**********%` as default. (There can be one or more `*`  in the middle and one or more `%` at the endpoints). You can specify your own regular expression in the `code-block.regularexpression"` option in `settings.json`. 

- When your cursor points in a certain block, the block will be highlighted. 

  ![image-20201023224330434](https://raw.githubusercontent.com/weihongliang233/My-Markdown-Figures/master/20201023225547.png)

  The highlight style can be specified by setting the option `code-block.color`.

  Of course if you don't won't this effect, just press `alt+d`. You will see the state of this extension in the status bar. ![image-20201023224521631](https://raw.githubusercontent.com/weihongliang233/My-Markdown-Figures/master/20201023225547-1.png)

  When you press `alt +d`, the state switches. But you need to move the cursor to let it take effect.(I set a listener listening to the cursor movement )

- Quickly navigate through blocks. If the current state is "code blocks enabled", when you press `ctrl+upArrow` or `ctrl+downArrow`, the cursor will go to the previous or next block.

  ![demo-navigate](https://raw.githubusercontent.com/weihongliang233/My-Markdown-Figures/master/20201023231214.gif)

- The above two functionality are optional enabled. The following is always enabled: Select the whole current block. Pressing the `alt+s` will select the whole current block.

  ![demo-select](https://raw.githubusercontent.com/weihongliang233/My-Markdown-Figures/master/20201023231214-1.gif)

## Known Issues

The first line of the file should not be the delimiter. (Despite that I didn't find any bugs caused by it, but I just didn't consider this situation when designing this extension).

The source file of this extension uses Chinese comments (Due to my scrappy English). I may translate them into English when I have the time.

## Release Notes

### 0.0.1

Initial release.

### 0.0.2

Adding options to enable users to specify the background color of the highlighted code block and the regular expression of the delimiter.