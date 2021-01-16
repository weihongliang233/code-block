//����ļ����ڴ���ȷ����Ԫ��ʱ��������ѧ����

//�ָ����ķֲ����ܻ�����һЩbug��������Ҫ�Եķֲ����з���

//  1.�������
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

//  2.����ƥ�䣨Ҳ�����ı��ĵ�һ�о���delimiter��
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

//  3.ͬ����β��ƥ��

//  4.���п�������λ��ƥ��ָ���

/*  ǰ���getLineNumbers�����ܵõ�count���飬���count����洢�˷ָ�����λ�ã���������

    ��Ȼ����������Ԫ�ز�һ����0��βԪ��Ҳ��һ�����ı���������1. Ȼ���ҷ��������������ո������������Ļ�����ô���

    ���Խ�����дһ������ProcessLineNumberArray������count����,����׸�Ԫ�ز���0�Ļ��͸���unshitfһ��0����0�Ļ��Ͳ�����ͬ��βԪ��Ҳ����������

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
����һ��������ȷ��������ڵ����䣨һ����Ԫ���飩��

һ�����̫�ѱ�д�ˣ�����ٶ����ǲ���ѷָ����������У������п��ܷ������һ�С����Ҽٶ����������зָ��а���һ��.

������ˣ�Ŀǰ����Ȼ���ܱ�֤�������������bug�������������������������һ�������ҵ�Ԫ�񶼴��ڻ��ߵ���2��
*/

//������дһ�������Ƿ��Ѿ����ַָ������Ƿ��׶Ρ��Ƿ����һ�С��Ƿ�ָ�����
export function Interval(array:number[],CursorLine:number):number[] {
    //�ж��Ƿ��Ѿ����ַָ���
    if (array.length<3){
        //��������ļ��ж�û�г��ָ����Ļ�
        return array;
    }
    //����Ѿ������˷ָ���
    else{
        //����Ƿ��ڵ�һ����Ԫ��
        if(CursorLine<array[1]){
            //����ڵ�һ����Ԫ��Ļ�
            return [0,array[1]-1];
        }
        else{
            /*
            �������λ�ڵ�һ����Ԫ��Ļ�����Ҫ�ҵ������ĸ���Ԫ��.
            ������ͨ������ѭ�����ҵ��������ڵ��ڵ�ǰ������С�ָ���
            */
            var index=0;
            while(array[index]<CursorLine){
                index++;
            }
            //��ʱ��indexһ���Ǵ���1��
            //�жϹ���Ƿ��ڷָ���
            if (CursorLine==array[index]){
                //����Ƿָ��еĻ�,�����ж��Ƿ������һ��
                return [array[index],array[index]];
            }
            //������Ƿָ��еĻ�����Ҫ�жϹ���Ƿ������һ�У���Ϊ��������ǲ�һ����
            else{
                //�ж��Ƿ����һ��
                if (index==array.length-1) {
                    //��������һ�У���ô�������Ϊ�����һ����
                    return [array[index-1]+1,array[index]];
                }
                else{
                    //����������һ�У�������һ�񽫻��Ϊ�����һ����
                    return [array[index-1]+1,array[index]-1];
                }
            }
        }
    }

    }

