// 1.单例模式：
//     定义：保证一个类只有一个实例，并且提供一个访问他的全局访问点。
//     需求：一些对象我们往往只需要一个，比如说线程池、全局缓存、浏览器中的window对象、登录浮框等。
//     实现：用一个变量标识当前是否已经为某个类创建过对象，如果是，则在下一次获取玩这个类的实例时，直接返回之前创建的对象。
// 2.代理模式：
//     定义：为一个对象提供一个占位符或者代用品，以便控制对他的访问。
//     优点：对外提供统一的接口，而代理类在接口中实现对真实类的附加操作功能。从而在不影响外部调用的情况下，进行系统的扩展。
//         也就是说，我要修改真实角色的操作的时候，尽量不去修改他，而是在她外部‘包’一层进行附加行为，即代理类。
//     需求：虚拟代理（把一些开销比较大的对象或行为，延迟到真正需要他的时候再去创建或执行）、缓存代理（可以为一些开销大的运算结果提供暂时的储存，在下次运算时，如果参数一致，则直接返回）
//     const MyImage = function(src) {
//         this.imgNode = document.createElement('img')
//         this.imgNode.src = src
//         document.body.appendChild(imgNode)
//     }
//     MyImage.prototype.setSrc = function(src) {
//         this.imgNode.src = src
//     }
//     const img1 = new MyImage()

//     const proxyImage = function(src) {
//         this.img = new MyImage()
//         this.image = new Image
//         this.setSrc(src)
//         image.onload = function() {
//             img.setSrc(this.src)
//         }
//     }
//     proxyImage.prototype.setSrc = function(src) {
//         img.setSrc('loading.jpg')
//         image.src = src
//     }
// 3.策略模式：
//     定义：定义一系列算法，把他们封装起来，并且使他们可以相互替换。策略类负责具体的算法，环境类负责接收客户的请求。
//     需求：表单验证、动画(linear/easeIn/strongEaseOut/strongEaseIn)
//     const strategies = {
//         isNonEmpty(value, errorMsg) {
//             if (!value) {
//                 return errorMsg
//             }
//         },
//         minLength(value, length, errorMsg) {
//             if (value.length < length) {
//                 return errorMsg
//             }
//         },
//         isMobile(value, errorMsg) {
//             if (!/^1[3|5|5][0-9]{9}$/.test(value)) {
//                 return errorMsg
//             }
//         }
//     }
//     class Validator {
//         constructor() {
//             this.cache = []
//         }
//         validate() {
//             for (let validatorFunc of this.cache) {
//                 const msg = validatorFunc()
//                 if (msg) {
//                     return msg
//                 }
//             }
//         }
//         add(dom, rules) {
//             const self = this
//             for (let rule of rules) {
//                 (function (rule) {
//                     self.cache.push(function () {
//                         const strategyArr = rule.strategy.split(':')
//                         const errorMsg = rule.errorMsg
//                         const strategy = strategyArr.shift()
//                         strategyArr.unshift(dom.value)
//                         strategyArr.push(errorMsg)
//                         return strategies[strategy].apply(dom, strategyArr)
//                     })
//                 })(rule)
//             }
//         }
//     }
//     const validator = new Validator()
//     const registerForm = document.getElementById('registerForm');
//     validator.add(registerForm.userName, [{
//             strategy: 'isNonEmpty',
//             errorMsg: '用户名不能为空',
//         },
//         {
//             strategy: 'minLength:6',
//             errorMsg: '用户名长度不能少于6位',
//         },
//     ]);
//     validator.add(registerForm.password, [{
//         strategy: 'minLength:6',
//         errorMsg: '密码长度不能少于6位',
//     }, ]);
//     validator.add(registerForm.phoneNumber, [{
//         strategy: 'isMobile',
//         errorMsg: '手机号码格式不正确',
//     }, ]);
//     validator.validate()

//     registerForm.onsubmit = function(){
//         var errorMsg = validator.validate();
//         if (errorMsg) {
//             alert(errorMsg);
//             return false;
//         };
//     };
// 4.中介者模式：
//     定义：各个对象之间交互操作非常多，每个对象的行为操作都依赖彼此对方，修改一个对象的行为，同时会涉及到修改很多
//         其它对象的行为。创建一个中介对象，中介者把所有对象都统一管理起来，其它对象通过中介者和别的对象通信。
//     需求：
//         1.一组定义良好的对象，现在要进行复杂的通信
//         2.定制一个分布在多个类中的行为，而又不像生成太多的子类
//         可以看出，中介对象主要是用来封装行为的，行为的参与者就是这些对象，但是通过中介者，这些对象不用相互知道.(迪米特法则的具体实现)
//         聊天室、MVC、泡泡堂游戏
//     优点：降低对象这件的耦合性，使得对象易于独立的被复用。提高系统灵活性，使得系统易于扩展和维护。中介者模式使网状的多对多关系变成了 相对简单的一对多关系。高内聚，低耦合，使用中介者明显降低了对象之间的耦合
//     class Participant {
//         constructor(name) {
//             this.name = name
//             this.chatRoom = null
//         }
//         send(message, to) {
//             this.chatRoom.send(message, this, to)
//         }
//         receive(message, from) {
//             console.log(from.name + ' to ' + this.name + ': ' + message)
//         }
//     }
//     // 中介者
//     class ChatRoom {
//         constructor() {
//             const participants = {}
//             return {
//                 register(participant) {
//                     participants[participant.name] = participant
//                     participant.chatRoom = this
//                 },
//                 send(message, from, to) {
//                     if (to) {
//                         to.receive(message, from)
//                     } else {
//                         for (let key in participants) {
//                             if (participants[key] !== from) {
//                                 participants[key].receive(message, from)
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }

//     var yoko = new Participant("Yoko");
//     var john = new Participant("John");
//     var paul = new Participant("Paul");
//     var ringo = new Participant("Ringo");
//     var chatroom = new ChatRoom();
//     chatroom.register(yoko);
//     chatroom.register(john);
//     chatroom.register(paul);
//     chatroom.register(ringo);
//     yoko.send("All you need is love.");
//     yoko.send("I love you John.");
//     john.send("Hey, no need to broadcast", yoko);
//     paul.send("Ha, I heard that!");
//     ringo.send("Paul, what do you think?", paul);
// 5.观察者模式：
//     定义：对象间的一种一对多的依赖关系
//     需求：当一个对象的状态发生变化时，所有依赖她的对象都将得到通知。DOM 事件监听也是 “发布订阅模式” 的应用，
//     优点：事件上的解耦，对象之间的解耦
//     const pubsub = {
//         list: {},
//         subscribe(key, fn) {
//             if (!this.list[key]) {
//                 this.list[key] = []
//             }
//             if (!fn) {
//                 throw new Error('缺少回调函数')
//             }
//             this.list[key].push(fn)
//         },
//         publish(key, ...arg) {
//             if (!this.list[key]) {
//                 throw new Error('不存在该订阅事件')
//             }
//             for (let fn of this.list[key]) {
//                 fn.call(this, ...arg)
//             }
//         },
//         unsubscribe(key, fn) {
//             if (!this.list[key]) {
//                 throw new Error('不存在该订阅事件')
//             }
//             if (!fn) {
//                 delete this.list[key]
//             } else {
//                 this.list[key].forEach((item, index) => {
//                     if (item === fn) {
//                         this.list[key].splice(index, 1)
//                     }
//                 })
//             }
//         }
//     }
//     const observer1 = () => {
//         console.log('observer1')
//     }
//     const observer2 = () => {
//         console.log('observer2')
//     }
//     pubsub.subscribe('change',observer1)
//     pubsub.subscribe('change',observer2)
//     pubsub.publish('change')
//     pubsub.unsubscribe('change', observer1)
//     pubsub.publish('change')
//     class Subject {
//         constructor() {
//             this.observres = []
//         }
//         add(observer) {
//             this.observres.push(observer)
//         }
//         remove(observer) {
//             const idx = this.observres.findIndex(x => x === observer)
//             idx > -1 && this.observres.splice(isx, 1)
//         }
//         notify() {
//             for (let observer of this.observres) {
//                 observer.update()
//             }
//         }
//     }
//     class Observer {
//         constructor(name) {
//             this.name = name
//         }
//         update() {
//             console.log(`目标对象通知我更新了，我是${this.name}`)
//         }
//     }
//     let subject = new Subject()
//     let obs1 = new Observer('前端开发者')
//     let obs2 = new Observer('后端开发者')
//     subject.add(obs1)
//     subject.add(obs2)
//     subject.notify()
// 6.职责链模式：
//     定义：使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，
//         将这些对象连成一条链，并沿着这条链传递请求，直到有一个对象处理它为止。
//          请求发送者只需要知道链中的第一个节点，从而弱化了发送者和一组接收者之间的强联系。
//     需求：挤公交：车上人多，只需要把钱传给前面的人，如果不是售票员就一直传递下去，直到传递给售票员
//         考试抄袭：遇到不会的题目，就把题目编号写在纸条上往后传递，直到有人会解答这个题目
//         流程图(公司请假流程)：小于2天经理记忆可以审批，大于两天要经理的上级审批
//         电商预定手机优惠活动
    
//     var Chain = function(fn) {
//         this.fn = fn
//         this.nextFn = null
//     }
//     Chain.prototype.setNextFn = function(fn) {
//         this.nextFn = fn
//         return fn
//     }
//     Chain.prototype.passRequest = function() {
//         var ret = this.fn.apply(this, arguments)
//         if (ret === 'pass') {
//             return this.nextFn && this.nextFn.passRequest.apply(this.nextFn, arguments)
//         }
//         return ret
//     }
//     Chain.prototype.next = function() {
//         return this.nextFn && this.nextFn.passRequest.apply(this.nextFn, arguments)
//     }

//     // 申请：（请假类型， 数字）
//     // type: 1：请假；2：调薪
//     // number： 天数/金额

//     // LevelAMan: 请假 && 天数小于2
//     // LevelBMan: 请假 && 天数小于5
//     // LevelCMan: (请假 && 任意天数) || (调薪 && 金额小于500)

//     var LevelAMan = new Chain(function(type, number) {
//         if (type === 1 && number <= 2) {
//             // console.log('请假' + number + '被批准')
//             setTimeout(() => {
//                 this.next(type, number)
//             }, 4000)
//         } else {
//             return 'pass'
//         }
//     })

//     var LevelBMan = new Chain(function(type, number) {
//         if (type === 1 && number <= 5) {
//             console.log('请假' + number + '被批准')
//         } else {
//             return 'pass'
//         }
//     })

//     var LevelCMan = new Chain(function(type, number) {
//         if (type === 1) {
//             console.log('请假' + number + '被批准')
//         } else if (type === 2){
//             if (number <= 500) {
//                 console.log('调薪' + number + '元被批准')
//             } else {
//                 console.log('调薪' + number + '元待定')
//             }
//         }
//     })

//     LevelAMan.setNextFn(LevelBMan).setNextFn(LevelCMan)
//     LevelAMan.passRequest(1, 2)


//     Function.prototype.after = function(fn) {
//         var self = this
//         return function() {
//             var ret = self.apply(this, arguments)
//             if (ret === 'pass') {
//                 return fn.apply(this, arguments)
//             }
//             return ret
//         }
//     }
// 7.状态模式：
//     定义: 允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类。
//     优点：
//         1.状态模式定义了状态与行为之间的关系，并将它们封装在一个类里。通过增加新的状态类，很容易增加新的状态和转换。
//         2.避免 Context 无限膨胀，状态切换的逻辑被分布在状态类中，也去掉了 Context 中原本过多的条件分支
//         3.Context中的请求动作和状态类中封装的行为可以非常容易地独立变化而互不影响。
//     需求：灯开关、文件上传、状态机
//     var StatusFactory = function(params) {
//         var Status = function() {}
//         Status.prototype.buttonHandler = function() {
//             throw new Error('子类必须重写该方法')
//         }
//         var F = function(Light) {
//             this.light = Light
//         }
//         F.prototype = new Status()
//         for (var i in params) {
//             F.prototype[i] = params[i]
//         }
//         return F
//     }
//     var OffLightStatus = StatusFactory({buttonHandler: function off() {
//         console.log('关灯状态')
//         this.light.setStatus(this.light.onLightStatus)
//         this.light.button.innerHTML="开灯"
//     }})
//     var OnLightStatus = StatusFactory({buttonHandler: function on() {
//         console.log('开灯状态')
//         this.light.setStatus(this.light.offLightStatus)
//         this.light.button.innerHTML="关灯"
//     }})

//     var Light = function() {
//         this.offLightStatus = new OffLightStatus(this)
//         this.onLightStatus = new OnLightStatus(this)
//         this.status = this.onLightStatus;
//         this.init()
//     }
//     Light.prototype.init = function() {
//         this.button = document.createElement('button')
//         this.button.innerHTML = '开灯'
//         document.body.appendChild(this.button)
//         var _this = this
//         this.button.onclick = function() {
//             _this.status.buttonHandler()
//         }
//     }
//     Light.prototype.setStatus = function(status) {
//         this.status = status
//     }
//     var light = new Light()
// 8.享元模式：
// 9.工厂模式：
//     定义：将其成员对象的实例化推迟到子类来实现的类。
//     需求：创建对象的流程赋值的时候，比如依赖于很多设置文件等；处理大量具有相同属性的小对象
//     优点：不暴露创建对象的具体逻辑，而是将逻辑封装在函数中。
//     分类：简单工厂，工厂方法，抽象工厂（简单工厂和工厂方法都是生成实例，而抽象工厂是生成类）
// 10.装饰者模式：
//     定义：给对象动态添加职责的方式就是装饰者模式。能够在不改变原对象的情况下，在运行时给对象添加新的职责。
//     需求：扩展一个类的功能或者给一个类添加附加职责。给一个对象动态的添加功能，或动态撤销功能
//     优点：
//         1.继承的有力补充，比继承灵活，不改变原对象的情况下给一个对象扩展功能。
//             （继承在扩展功能是静态的，必须在编译时就确定好，而使用装饰着可以在运行时决定，装饰者也建立在继承的基础之上）
//         2.通过使用不同装饰类以及这些类的排列组合，可以实现不同的效果
//         3.符合开闭原则
    
    // Function.prototype.before = function(beforeFn) {
    //     var _self = this
    //     return function() {
    //         beforeFn.apply(this, arguments)
    //         return _self.apply(this, arguments)
    //     }
    // }
    // 例子1： ajax加token解决CSRF攻击
    // var ajax = function(type, url, params) {
    //     console.dir(params)
    // }
    // // ajax('type', 'http://xx.com/userinfo', {name:'match'})

    // // 加token
    // var getToken = function(){
    //     return'Token';
    // }
    // ajax = ajax.before(function(type, url, params) {
    //     params.token = getToken()
    // })
    // ajax('type', 'http://xx.com/userinfo', {name:'match'})

    // 例子2：表单提交
    // formSubmit承担两个任务：表单验证和ajax提交
    // var username = document.getElementById( 'username' ),
    // password = document.getElementById( 'password' ),
    // submitBtn = document.getElementById( 'submitBtn' );
    // var formSubmit = function(){
    //     if ( username.value === '' ){
    //         return alert ( '用户名不能为空' );
    //     }
    //     if ( password.value === '' ){
    //         return alert ( '密码不能为空' );
    //     }
    //     var param = {
    //         username: username.value,
    //         password: password.value
    //     }
    //     ajax( 'http://xx.com/login', param ); // ajax 具体实现略
    // }
    // submitBtn.onclick = function(){
    //     formSubmit();
    // }
    // 优化后
    // Function.prototype.before = function(beforeFn) {
    //     var self = this
    //     return function() {
    //         if (beforeFn.apply(this, arguments) === false) {
    //             return
    //         }
    //         return self.apply(this, arguments)
    //     }
    // }
    // var validata = function(){
    //     if ( username.value === '' ){
    //         alert ( '用户名不能为空' );
    //         return false;
    //     }
    //     if ( password.value === '' ){
    //         alert ( '密码不能为空' );
    //         return false;
    //     }
    // }
    // var formSubmit = function(){
    //     var param = {
    //         username: username.value,
    //         password: password.value
    //     }
    //     ajax( 'http://xx.com/login', param );
    // }
    // formSubmit = formSubmit.before(validata)
    // submitBtn.onclick = function(){
    //     formSubmit();
    // }

// 11.命令模式：
//     定义：用来对方法调用进行参数化处理和传送，经过这样处理的方法调用可以在任何需要的时候执行。
//     需求：有时候需要向某个对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么，
//         此时希望用一种松耦合的方式来设计软件，使得请求发送者和接收者能够消除彼此之间的耦合关系。
    



装饰者模式和代理模式的区别：
    两者都是对类的方法进行扩展，但装饰器模式强调的是增强自身，在被装饰之后你能够在被增强的类上使用增强后的功能。增强后你还是你，只不过能力更强了而已。
    而代理模式则强调让别人帮你去做一些本身与你业务没有太多关系的职责(记录日志、设置缓存)。代理模式是为了实现对象的控制，因为被代理的对象往往难以获得或者是其内部不想暴露出来。
    代理模式的目的是，当直接访问本体不方便或者不符合需要时，为这个本体提供一个替代者。本体定义了关键功能，而代理提供或者拒绝对它的访问，或者在访问本体之前做一些额外的事情。
    装饰者模式的作用就是为对象动态加入行为。换句话说，代理模式强调一种关系（proxy与实体之间的关系），这种关系可以静态的表达，也就是说，这种关系在一开始就可以被确定。
    而装饰者模式用于一开始不能确定对象的全部功能时。代理模式通常只有一层代理——本体的引用，而装饰者模式经常会形成一条长长的装饰链。

