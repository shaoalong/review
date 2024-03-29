一.正则表达式引擎：
    正则引擎大体上可分为不同的两类：DFA和NFA
    大多数语言和工具使用的是传统型的NFA引擎，它有一些DFA不支持的特性：
        1.捕获组、反向引用和$number引用方式；
        2.环视(Lookaround，(?<=…)、(?<!…)、(?=…)、(?!…))，或者有的有文章叫做预搜索；
        3.忽略优先量词（??、*?、+?、{m,n}?、{m,}?），或者有的文章叫做非贪婪模式；
        4.占有优先量词（?+、*+、++、{m,n}+、{m,}+，目前仅Java和PCRE支持），固化分组(?>…)。
二.预备知识：
    1.字符串组成：
        对于字符串'abc': 0a1b2c3,包含3个字符，4个位置。
    2.占有字符和零宽度：
        正则表达式匹配过程中，如果子表达式匹配到的是字符内容，而非位置，并保存到最终的匹配结果中，那么就认为这个子表达式是占有字符的；
        如果子表达式匹配的仅仅是位置，或者匹配到的内容并不保存到最终的匹配结果中，那么久认为这个子表达式是零宽度的。

        占有字符是互斥的，零宽度是非互斥的。也就是一个字符，同一时间只能由一个子表达式匹配，而一个位置，却可以同时由多个零宽度的子表达式匹配。
    3.控制权和传动：
        正则的匹配过程，通常情况下都是由一个子表达式取得控制权，从字符串的某一个位置开始尝试匹配，一个子表达式开始尝试匹配的位置，是从前一个子表达式匹配成功的位置开始的。
        (子表达式1)(子表达式2)
        假设(子表达式1)为零宽度表达式，由于匹配开始和结束的位置是同一个，如位置0，那么(子表达式2)是从位置0开始尝试匹配的
        假设(子表达式1)为占有字符的表达式，由于匹配开始和结束的位置不是同一个，如匹配成功开始于位置0，结束于位置2，那么(子表达式2)是从位置2开始尝试匹配的。
        
        而对于整个表达式来说，通常是由字符位置0开始尝试匹配的。如果在位置0开始的尝试，匹配到字符串某一位置时整个表达式匹配失败，那么引擎会使正则向前传动，
        整个表达式从位置1开始重新尝试匹配，以此类推，直到报告匹配成功或尝试到最后一个位置后报告匹配失败。
三.正则表达式简答匹配过程：
    1.基础匹配过程：
        源字符串:abc
        正则表达式:abc
        匹配过程：
            首先由字符"a"取得控制权，从位置0开始匹配，由"a"来匹配"a"，匹配成功，控制权交给字符"b";
            由于"a"已经被匹配，所以"b"从位置1开始尝试匹配，由"b"来匹配"b",匹配完成，控制权交给"c";由"c"来匹配"c"，匹配成功。
            此时正则表达式匹配完成，报告匹配完成。匹配结果为"abc"，开始位置为0，结束位置是3。
    2.含有匹配优先量词的匹配过程--匹配成功（一）
        源字符串：abc
        正则表达式：ab?c
        量词“?”属于匹配优先量词，在可匹配可不匹配时，会先选择尝试匹配，只有这种选择会使整个表达式无法匹配成功时，才会尝试让出匹配到的内容。这里的量词“?”是用来修饰字符“b”的，所以“b?”是一个整体。
        匹配过程：
            首先由字符“a”取得控制权，从位置0开始匹配，由“a”来匹配“a”，匹配成功，控制权交给字符“b?”；由于“?”是匹配优先量词，所以会先尝试进行匹配，由“b?”来匹配“b”，匹配成功，控制权交给“c”，
            同时记录一个备选状态；由“c”来匹配“c”，匹配成功。记录的备选状态丢弃。
            此时正则表达式匹配完成，报告匹配成功。匹配结果为“abc”，开始位置为0，结束位置为3。
    3.含有匹配优先量词的匹配过程——匹配成功（二）
        源字符串：ac
        正则表达式：ab?c
        匹配过程：
            首先由字符“a”取得控制权，从位置0开始匹配，由“a”来匹配“a”，匹配成功，控制权交给字符“b?”；先尝试进行匹配，由“b?”来匹配“c”，同时记录一个备选状态，匹配失败，
            此时进行回溯，找到备选状态，“b?”忽略匹配，让出控制权，把控制权交给“c”；由“c”来匹配“c”，匹配成功。
            此时正则表达式匹配完成，报告匹配成功。匹配结果为“ac”，开始位置为0，结束位置为2。其中“b?”不匹配任何内容。
    4.含有匹配优先量词的匹配过程——匹配失败
        源字符串：abd
        正则表达式：ab?c
        匹配过程：
            首先由字符“a”取得控制权，从位置0开始匹配，由“a”来匹配“a”，匹配成功，控制权交给字符“b?”；先尝试进行匹配，由“b?”来匹配“b”，同时记录一个备选状态，匹配成功，控制权交给“c”；
            由“c”来匹配“d”，匹配失败，此时进行回溯，找到记录的备选状态，“b?”忽略匹配，即“b?”不匹配“b”，让出控制权，把控制权交给“c”；由“c”来匹配“b”，匹配失败。此时第一轮匹配尝试失败。
            正则引擎使正则向前传动，由位置1开始尝试匹配，由“a”来匹配“b”，匹配失败，没有备选状态，第二轮匹配尝试失败。
            继续向前传动，直到在位置3尝试匹配失败，匹配结束。此时报告整个表达式匹配失败。
    5.含有忽略优先量词的匹配过程——匹配成功
        源字符串：abc
        正则表达式：ab??c
        量词“??”属于忽略优先量词，在可匹配可不匹配时，会先选择不匹配，只有这种选择会使整个表达式无法匹配成功时，才会尝试进行匹配。这里的量词“??”是用来修饰字符“b”的，所以“b??”是一个整体。
        匹配过程：
            首先由字符“a”取得控制权，从位置0开始匹配，由“a”来匹配“a”，匹配成功，控制权交给字符“b??”；先尝试忽略匹配，即“b??”不进行匹配，同时记录一个备选状态，控制权交给“c”；
            由“c”来匹配“b”，匹配失败，此时进行回溯，找到记录的备选状态，“b??”尝试匹配，即“b??”来匹配“b”，匹配成功，把控制权交给“c”；由“c”来匹配“c”，匹配成功。
            此时正则表达式匹配完成，报告匹配成功。匹配结果为“abc”，开始位置为0，结束位置为3。其中“b??”匹配字符“b”。
    6.零宽度匹配过程
        源字符串：a12
        正则表达式：^(?=[a-z])[a-z0-9]+$
        元字符“^”和“$”匹配的只是位置，顺序环视“(?=[a-z])”只进行匹配，并不占有字符，也不将匹配的内容保存到最终的匹配结果，所以都是零宽度的。
        这个正则的意义就是匹配由字母或数字组成的，第一个字符是字母的字符串。
        匹配过程：
            首先由元字符“^”取得控制权，从位置0开始匹配，“^”匹配的就是开始位置“位置0”，匹配成功，控制权交给顺序环视“(?=[a-z])”；
            “(?=[a-z])”要求它所在位置右侧必须是字母才能匹配成功，零宽度的子表达式之间是不互斥的，即同一个位置可以同时由多个零宽度子表达式匹配，所以它也是从位置0尝试进行匹配，位置0的右侧是字符“a”，符合要求，匹配成功，控制权交给“[a-z0-9]+”；
            因为“(?=[a-z])”只进行匹配，并不将匹配到的内容保存到最后结果，并且“(?=[a-z])”匹配成功的位置是位置0，所以“[a-z0-9]+”也是从位置0开始尝试匹配的，
            “[a-z0-9]+”首先尝试匹配“a”，匹配成功，继续尝试匹配，可以成功匹配接下来的“1”和“2”，此时已经匹配到位置3，位置3的右侧已没有字符，这时会把控制权交给“$”；
            元字符“$”从位置3开始尝试匹配，它匹配的是结束位置，也就是“位置3”，匹配成功。
            此时正则表达式匹配完成，报告匹配成功。匹配结果为“a12”，开始位置为0，结束位置为3。其中“^”匹配位置0，“(?=[a-z])”匹配位置0，“[a-z0-9]+”匹配字符串“a12”，“$”匹配位置3。
四.贪婪模式与懒惰模式(非贪婪模式)
    贪婪模式:会匹配最长的以开始位置开始，以结束位置结束的字符串
    懒惰模式:匹配尽可能少的字符
    在限定符后加?,则为懒惰模式；在限定符后不加?,则为贪婪模式。
    例:
        var str = '<div>asdsadsad</div><div>23456</div>'
        var reg1 = /<div>.*<\/div>/g
        var reg2 = /<div>.*?<\/div>/g
        console.log(str.match(reg1)) // [ '<div>asdsadsad</div><div>123456</div>' ]
        console.log(str.match(reg2)) // [ '<div>asdsadsad</div>', '<div>123456</div>' ]

        // 模板替换
        var template = "{{name}}很厉害，才{{age}}岁"
        var context = {name: 'bottle', age: '15'}
        var render = function(template, context) {
            return template.replace(/\{\{(.*?)\}\}/g, (match, key, index, source) => {
                console.log(match, key, index, source)
                return context[key]
            })
        }
        console.log(render(template, context))

        // 给纯文本p标签加类
        var str = '<p class="content">asdfgh<img/></p><p>abcde</p></p><p>123456</p>'
        var reg = /<p[^>]*>((?!<img|<video|<p).|\n)*?<[/]p>/gi
        console.log(str.match(reg))
        var result = str.replace(reg, (match, key, index, source) => {
            console.log('match: ', match)
            console.log('key: ', key)
            console.log('index: ', index)
            console.log('source: ', source)
            return `${match.slice(0, 2)} pureTxt${match.slice(2)}`
        })
        console.log(result)


        // replace函数参数
        // match：匹配项（第一个参数）
        // key1：子组匹配项（第二个参数，如果有子组）
        // key2：子组匹配项（第三个参数，如果有第二个子组）
        // index：匹配项开始的下表（子组匹配项后面紧跟着match匹配项开始的下表）
        // source：正则匹配源字符串
        var str = '<p class="pStyle">asdfgh</p><p>abcde</p>'
        var reg = /<p([^>]*)>(.*?)<[/]p>/gi
        str.replace(reg, (match, key1, key2, index, source) => {
            console.log('match: ', match)
            console.log('key1: ', key1)
            console.log('key2: ', key2)
            console.log('index: ', index)
            console.log('source: ', source)
            return `${match.slice(0, 2)} pureTxt${match.slice(2)}`
        })

五.括号的区别与应用:
    1.():圆括号()是组，主要应用在限制多选结构的范围/分组/捕获文本/环视/特殊模式处理
        例子:
        1.1.(abc|bcd|cde),表示这一段是abc、bcd、cde三者之一，顺序也必须一致。
                const reg = /(abc|bcd|cde)/gi;
                const str = 'jksagdhjgcyaabcde'
                console.log(str.match(reg)) // ['abc']
        1.2.(abc)? 表示这一组要么一起出现，要么不出现，出现则按顺序出现
                const reg = /(abc)?rr/gi;
                const str = 'jksagdhjgcyarrcde'
                console.log(str.match(reg)) // ['rr']
        1.3.(?:abc)表示找到一样abc的一组，但是不记录，不保存到变量中，否则可以通过x取第几个括号所匹到的项
                const reg = /(aaa)(bbb)(ccc)(?:ddd)(eee)/gi;
                const str = 'aaabbbcccdddeee123'
                const test = reg.test(str)
                const res = str.replace(reg, '$1 $2 $3 $4 ')
                console.log(test)
                console.log(res) // 'aaa bbb ccc eee 123'
                $4表示的不是ddd而是eee，因为ddd不保存在变量中
        1.4.a(?=bbb)顺序环视 表示a后面必须紧跟3个连续的b
                const reg = /a(?=bbb)/gi;
                const str = 'aaabbbcccdddeee123'
                const test = reg.test(str)
                const res = str.match(reg)
                console.log(test)
                console.log(res) // ['a']
    2.[]字符类:方括号是单个匹配 字符集/排除字符集/命名字符集
        正则表达式字符类使用中括号[]定义。字符类有"字符"+"类"构成，字符很容易理解，比如字母或者数字等都是字符。类可以理解为某些共同特点，比如说人类、哺乳类等
        2.1.字符类基本应用：
			字符类可以匹配他所包含的任意一个字符，也就是说只要字符串中包含任意一个字符类的字符，那么就可以完成匹配。
			特表说明: 字符类的字符是以字符为单位进行匹配的，不能是字符的组合。
			let str="softwhy.com";
			let one=/[ft]/g;
			let two=/ft/g;
			console.log(str.match(one)); // [ 'f', 't' ]
			console.log(str.match(two)); // [ 'ft' ]
		2.2.反字符类：中括号以^起始可以构成一个反字符类。
			反字符类匹配除去中括号内所有字符外的任意一个字符。
			let str="an6t888";
            let reg=/[^0123456789]/g; // 匹配非数字字符
			console.log(str.match(reg)); // [ 'a', 'n', 't' ]
		2.3.定义字符类或者反字符类范围：所谓字符类范围（或者反字符类范围）就是指定起始与结尾字符，中间使用横线连接
			let str="www.softawhy.com";
			let reg=/[h-wab]/g; // 匹配h到w和a、b字符
			console.log(str.match(reg)); // [ 'w', 'w', 'w', 's', 'o', 't', 'a', 'w', 'h', 'o', 'm' ]
		2.4.预定义字符类：
			.: 匹配任意字符(除了回车符'\r'和换行符'\n')
			\w: 匹配字母数字。等价于[a-zA-Z0-9]
			\W: 匹配非字母数字。等价于[^a-zA-Z0-9]
			\d: 匹配数字。等价于[0-9]
			\D: 匹配非数字。等价于[^0-9]
			\s: 匹配空白符，包括空格符、制表符、回车符、换行符、垂直换行符和换页符。
				let str="蚂蚁部落 \n http://www.softwhy.com"; 
				let reg=new RegExp("\\s","g"); 
				console.log(str.match(reg)); // [ ' ', '\n', ' ' ]
				console.log(str.replace(reg, '')) // 蚂蚁部落http://www.softwhy.com
            \S: 匹配非空白符
        例子：
        1.[0-3]表示找到一个位置上的字符只能是0-3的四个数字
            const reg = /^[1-9]/gi;
            const str = '122'
            const test = reg.test(str)
            console.log(test) // true
        2.[^0-3]表示找到这个位置上字符只能是除了0到3之外的所有字符
            const reg = /[^0-3]/gi;
            const str = '422'
            const test = reg.test(str)
            console.log(test)
        3.
            const reg = /[b(ab)]/gi;
            const str = 'b(a)啊实打实的'
            const test = reg.test(str)
            const exec = reg.exec(str)
            const match = str.match(reg)
            console.log(test)
            console.log(exec)
            console.log(match)
        4.环视匹配,匹配不包含img标签的p标签
            const reg = /<p>((?!<img).)*<[/]p>/gi
            var str = '<p><p> 我是纯文本<br> </p><strong></strong><img src="http://api-uat.kyeapi.com/router/download/iaams_baike_answer/14/507dd4691df743859b78295ad227d63f"></p>'
            const res = str.match(reg)
            console.log(res) // [ '<p><p> 我是纯文本<br> </p>' ]