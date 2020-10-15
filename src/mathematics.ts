
//定义一个函数，用来处理getLineNumbers给出的数组。主要分4种情况：头行匹配，尾行匹配，双匹配，还有普通模式。
//主要是用来生成一个数组，数组的首个元素为0，最后元素为总行数-1

import { arch } from "os";

//这是一个直接修改原数组的办法，我现在没有看出什么问题来，但是我希望最后能够使用返回新数组的办法
export function  ProcessLineNumberArray(array:number[],FullTextLength:number) {
    if (array[0]==0) {
        if (array[array.length-1]==FullTextLength) {
            return array
        }
        else{
            array.push(FullTextLength)
        }
    }
    else{
        array.unshift(0);
        if (array[array.length-1]==FullTextLength) {
            return array
        }
        else{
            array.push(FullTextLength)
        }
    }
}

//测试片段
var array=[1,2,3,4];

ProcessLineNumberArray(array,5);

console.log(array.toString())


// 定义一个函数来确定光标所在的区间
//一般情况太难编写了，这里假定人们不会把分隔符放在首行，但是有可能放在最后一行
//而且假定不会有两行分隔行挨在一起
//以下来写一个树：是否已经出现分隔符，是否首段、是否最后一行、是否分隔符？
export function Interval(array:number[],CursorLine:number) {
    //判断是否已经出现分隔符
    if (array.length<3){
        //如果还没有出现分隔符
        return array
    }
    //如果已经出现了分隔符
    else{
        //是否首段
        if(CursorLine<array[1]){
            //如果是首段的话
            return [array[0],array[1]-1];
        }
        else{
            //如果不是首段的话
            //开始循环，会得到一个index
            var index=0;
            while(array[index]<CursorLine){
                index++
            }
            //这时的index一定是大于1的
            //判断是否分隔行
            if (CursorLine==array[index]){
                //如果是分割行的话,不必判断是否是最后一行
                return [array[index],array[index]]
            }
            //如果不是分隔行的话
            else{
                //判断是否最后一行
                if (index==array.length-1) {
                    //如果是最后一行，那么它将会成为区块的一部分
                    return [array[index-1]+1,array[index]]
                }
                else{
                    //如果不是最后一行，它的上一格将会成为区块的一部分
                    return [array[index-1]+1,array[index]-1]
                }
            }
        }
    }

    }

