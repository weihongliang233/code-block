//这个文件用于处理确定单元格时遇到的数学需求。

//分隔符的分布可能会引起一些bug，首先需要对的分布进行分类

//  1.理想情况
/*
    ^<-----------------------^-------->            
    |                        |                     
    |        Delimiter       |                     
    |                        |                     
    |                        |                     
    |                        |                     
    |      Delimiter         |                     
    |                        |                     
    |                        |                     
    |                        |                     
    |      Delimiter         |                     
    |                        |                     
    |                        |                  
    |      Delimiter         |                     
    |                        |                     
    |                        |                     
    |      Delimiter         |                     
    |                        |                     
    <------------------------v---------->
*/

//  2.首行匹配（也就是文本的第一行就是delimiter）
/*
    ^<--------Delimiter--------^-------->            
    |                        |                     
    |                        |
    |                        |                     
    |                        |                     
    |                        |                     
    |      Delimiter         |                     
    |                        |                     
    |                        |                     
    |                        |                     
    |      Delimiter         |                     
    |                        |                     
    |                        |                  
    |      Delimiter         |                     
    |                        |                     
    |                        |                     
    |      Delimiter         |                     
    |                        |                     
    <------------------------v---------->
*/

//  3.同理还有尾行匹配

//  4.还有可能是首位都匹配分隔符

/*  前面从getLineNumbers函数能得到count数组，这个count数组存储了分隔符的位置（行数）。

    显然这个数组的首元素不一定是0，尾元素也不一定是文本总行数减1. 然而我发现如果数组满足刚刚那两个条件的话会更好处理。

    所以接下来写一个函数ProcessLineNumberArray来处理count数组,如果首个元素不是0的话就给他unshitf一个0，是0的话就不动；同理尾元素也是这样处理。

*/

export function  ProcessLineNumberArray(array:number[],FullTextLength:number):void {
    if (array[0]==0) {
        if (array[array.length-1]==FullTextLength) {
            // do nothing
        }
        else{
            array.push(FullTextLength);
        }
    }
    else{
        array.unshift(0);
        if (array[array.length-1]==FullTextLength) {
            //do  nothing
        }
        else{
            array.push(FullTextLength);
        }
    }
}

/*
定义一个函数来确定光标所在的区间（一个二元数组）。

一般情况太难编写了，这里假定人们不会把分隔符放在首行，但是有可能放在最后一行。而且假定不会有两行分隔行挨在一起.

尽管如此，目前我仍然不能保证这个函数不会有bug。最理想的情况是像“理想情况”一样，而且单元格都大于或者等于2行
*/

//以下来写一个树：是否已经出现分隔符，是否首段、是否最后一行、是否分隔符？
export function Interval(array:number[],CursorLine:number):number[] {
    //判断是否已经出现分隔符
    if (array.length<3){
        //如果整个文件中都没有出分隔符的话
        return array;
    }
    //如果已经出现了分隔符
    else{
        //光标是否在第一个单元格
        if(CursorLine<array[1]){
            //如果在第一个单元格的话
            return [0,array[1]-1];
        }
        else{
            /*
            如果不是位于第一个单元格的话，就要找到它在哪个单元格.
            接下来通过条件循环来找到行数大于等于当前光标的最小分隔符
            */
            var index=0;
            while(array[index]<CursorLine){
                index++;
            }
            //这时的index一定是大于1的
            //判断光标是否处于分隔行
            if (CursorLine==array[index]){
                //如果是分割行的话,不必判断是否是最后一行
                return [array[index],array[index]];
            }
            //如果不是分隔行的话，需要判断光标是否处于最后一行，因为两种情况是不一样的
            else{
                //判断是否最后一行
                if (index==array.length-1) {
                    //如果是最后一行，那么它将会成为区块的一部分
                    return [array[index-1]+1,array[index]];
                }
                else{
                    //如果不是最后一行，它的上一格将会成为区块的一部分
                    return [array[index-1]+1,array[index]-1];
                }
            }
        }
    }

    }

