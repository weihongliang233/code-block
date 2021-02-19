# code-block README

这是一个VScode小插件，用于将文本分隔成不同的小区块（单元格），类似于Jupyter/Mathematica。

"ctrl+shift+p" 然后执行指令 "Change State" 后即可激活这个插件。

## 写这个插件的动机

交互式编程已成为编程的新趋势。 Mathematica，IPython（Jupyter）和Matlab Live Script是一些示例。它们有一些共同点，都具有称为代码单元的结构，或者我更喜欢将其称为“代码块”(code-block)。每次您都可以运行整个块。在VScode中实现这样的功能是很合理的。您可能会争辩说，VScode中已经为Juyter Notebook提供了很好的补充。但是我的观点是，我们应该能够在原始代码文件中做到这一点。不是`.ipynb`而是`.py`。

我原先参与过一个项目[vscode-matlab-interactive-terminal](https://github.com/apommel/vscode-matlab-interactive-terminal)。它提供了在VScode中运行选定的Matlab代码的功能。但是有人提过一个issue，大意是[一次运行一整个代码块](https://github.com/apommel/vscode-matlab-interactive-terminal/issues/13)。我认为在编辑器中将代码分块其实是个普遍需求，因为几乎所有能交互运行的语言（大多是科学计算）都可以受益于此。我的做法是将一些注释语句解释为分隔符，从而将代码文本分段，符合特定正则表达式的注释可以充当分隔符的角色，同时不会破坏正式代码，更加不需要专门制定一种二进制文件（如`.ipynb`）。

同时，分割文件的这种办法不应该和特定语言绑定。所以我在这个插件实现跟文本操作相关的功能。例如高亮代码区块、快速区块间导航、选中当前区块等等；而不包括“将当前代码区块递交给MATLAB终端执行”这样的操作，因为这些操作可以另外在其他插件实现，届时借助类似[multi-command](https://marketplace.visualstudio.com/items?itemName=ryuta46.multi-command)这样的插件即可将这些操作联合起来。

## 功能与用法

- 以特定的正则表达式作为分隔符，实现上述文本分割。目前用的是`%****（一个或任意多个星号）**%`。在未来版本中将会实现为不同语言配置不同的正则表达式（其实现在github仓库里面已经基本实现了，但是还有一些别的工作要做所新版本暂时没有发在插件市场上）

-  插件激活后，你将可以看到类似下面的效果：光标当前所在的区块被高亮。高亮颜色也可以被设置，在`code-block.color`项中可以设置。![image-20201023224521631](https://raw.githubusercontent.com/weihongliang233/My-Markdown-Figures/master/20201023225547-1.png)

  当然，有时候你不想要这个高亮效果的话，可以"Disable"它。Disabled和Enabled状态会在任务栏显示：

  ![image-20201023224330434](https://raw.githubusercontent.com/weihongliang233/My-Markdown-Figures/master/20201023225547.png)

  按下`alt+d`即可在这两种状态之间切换，不过切换后需要移动一下光标（上下左右键）才会生效。因为我监听的是光标移动事件。

- 代码区块间快速移动导航。

  按下`ctrl+upArrow` 或者 `ctrl+downArrow`, 光标就会快速跳转到上一个或者下一个单元格。

  ![demo-navigate](https://raw.githubusercontent.com/weihongliang233/My-Markdown-Figures/master/20201023231214.gif)

  我个人这个功能还是蛮有用的，但是目前它有点不完善的地方就是，如果你的代码文件很长，那么快速导航的时候如果跳到屏幕最下方以外的区域，视图不会自动滚动到那儿，我至今没有找到解决办法…

- 上面两个功能是可以用`alt+d`来启用或者禁用的，但是以下这个功能则不会被禁用，只要插件还在运行，它就会起作用：按下`alt+s`键选中当前区块的所有内容。

  ![demo-select](https://raw.githubusercontent.com/weihongliang233/My-Markdown-Figures/master/20201023231214-1.gif)

  这个功能就可以作为"递交至终端"的前序步骤…

  ## TODO

  1. 实现选中当前文本后写入临时文件，最后在终端执行类似"run tempFile"这样的指令来实现交互。
  2. 在侧栏显示计算顺序（类似于Mathematica和Jupyter）
  3. 补充代码注释，然后将注释翻译成英文的
  4. 写一份更好的README
