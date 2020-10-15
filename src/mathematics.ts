
//定义一个函数，用来处理getLineNumbers给出的数组。主要分4种情况：头行匹配，尾行匹配，双匹配，还有普通模式。
//主要是用来生成一个数组，数组的首个元素为0，最后元素为总行数-1
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