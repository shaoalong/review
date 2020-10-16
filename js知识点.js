1. ie8 console polyfill 
	window.console = window.console || (function () {
		var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile
		= c.clear = c.exception = c.trace = c.assert = function () { };
		return c;
	})();

2. ie78不支持媒体查询，添加respond.js支持媒体查询
	if(navigator && navigator.userAgent){
		var isIE78 = navigator.userAgent.indexOf("MSIE 7.0")>0 || navigator.userAgent.indexOf("MSIE 8.0")>0;
		if(isIE78){
			require(['respond']);
		}
	}

3. 谷歌浏览器允许跨域方法：创建谷歌快捷键-属性-目标改为 "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir=D:\MyChromeDevUserData;path\chrome.exe --explicitly-allowed-ports=100

4. font-face引入字体在写兼容src时eot文件后加“?iefix”

5. parseInt在IE中要加入取整进制：parseInt(0.45,10);因为IE默认取整八进制

6. trim()在IE8不兼容，会报错 用$.trim()代替

7. undefined === void 0; (void 跟无论什么都返回undefined；)

8. javascript中可以在某个元素前使用
	'+':这个操作是将该元素转换成Number类型，如果转换失败，那么将得到NAN。等同于Number转换。 + new Date() 等同于 new Date().getTime() 
	'*':
	'|':  位或运算，把数值转换成二进制在进行或运算。
		例： 2 | 3  ==> 10 | 11 === 11 === 3;
			2.3 | 0 ==> 10.0100 | 0 === 10 === 2 (所以数字位或0可以达到取整的目的)
			

9. el.replaceChild(newEl, oldEl)  (js替换子节点)

10. document.createComment('') (生成注释节点)

11. 浅拷贝与深拷贝：浅拷贝只复制指向某个对象的指针，而不是复制对象本身，新旧对象还是共享一块内存。
					但深拷贝会另外创造一个一模一样的对象，新对象跟员对象不共享内存，修改新对象不会改变原对象。
	对象浅拷贝方法：
		1).Object.assign();
		2).Array.prototype.concat();
		2).Array.prototype.slice();
		注:Array的这两个方法不会改变原数组，原数组的元素会按照以下规则拷贝：
			1>. 如果该元素是对象运用，slice/concat会拷贝这个对象引用到新的数组中，两个对象都引用一个对象。如果被引用的对象发生改变，则新的数组和原来的数组这个元素也会改变。
			2>. 否则，slice/concat会拷贝这个这些值到新的数组里，在别的数组里修改这些字符串或者数字或者布尔值，将不会印象到另一个数组。
	对象深拷贝方法：
		1). JSON.parse配合JSON.stringfy。（只适用于纯数据json对象的深度拷贝，会忽略function及undefined字段。而且只能克隆原始对象的值，不能克隆继承的值）
		2). 递归方法实现深拷贝
		3). 函数库lodash提供_cloneDeep
	
12. setTimeout/setInterval的第三个及之后的参数：作为第一个参数的参数传进该函数。

13. a + b 运算背后的故事：
	在javascript中有两种值：primitives和objects。原始类型的值有： undefined、null、boolean、number、string，其他的都是object。
	值得转换(规范中的抽象方法，用不到)：加号运算符能执行三种转换（把值转成primitive、数字、字符串）
		1.通过ToPrimitive(input, PreferredType?)将值转换成原始类型：
			如果PreferredType是Number，执行顺序如下：
			1>.如果input是primitive，返回。
			2>.否则input为Object，调用obj.valueOf(),如果结果是primitive，返回。
			3>.否则调用obj.toString()，如果结果是primitive，返回。
			4>.如果抛出TypeError。
			如果PreferredType是String，步骤2与步骤3互换。
			如果PreferredType没有，Date实例被设置成String，其他都是Number。
		2.通过ToNumber()把值转换成Number：
			直接看ECMA 9.3的表格http://es5.github.io/#x9.3
			undefined NaN
			null +0
			boolean value true is converted to 1, false is converted to +0
			number value no conversion necessary
			string value parse the number in the string.
		3.通过ToString()把值转化成String:
			直接看ECMA 9.8的表格http://es5.github.io/#x9.8
			undefined “undefined”
			null “null”
			boolean value either “true” or “false”
			number value the number as a string, e.g. “1.765〃
			string value no conversion necessary
		例：var obj = {
				valueOf: function () {
					console.log("valueOf");
					return {}; // not a primitive
				},
				toString: function () {
					console.log("toString");
					return {}; // not a primitive
				}
			}
			Number(obj)
			//输出如下：
			//valueOf 返回的不是原始类型，继续往下走
			//toString 返回的不是原始类型，继续往下走
			//TypeError: Cannot convert object to primitive value 抛出错误
	相加：value1 + value2 对表达式求值时，遵循以下步骤：
		1. 转换操作符两边的值为原始值:
			prim1 = ToPrimitive(value1)
			prim2 = ToPrimitive(value2)
		2. 如果prim1或者prim2有一个是String，把这两个值都转化成String，返回相连的结果；否则返回两个转化成Number相加的结果。
		例：[] + [] === ''
			1>. [].valueOf(); // []  不是primitive
			2>. [].toString(); // '' 是primitive,返回。
			3>. '' + '' === ''; // 相加输出结果 '';
			
			[] + {} === '[object Object]'
			1>. ({}.valueOf()); // {} 不是primitive
			2>. ({}.toString()); // '[object Object]' 是primitive，返回
			3>. '' + '[object Object]' === '[object Object]'; //相加输出结果'[object Object]'
			
			2 + [2] === '22';
			1>. [2].valueOf(); // [2] 不是primitive
			2>. [2].toString(); // '2' 是primitive,返回。
			3>. 2 + '2' === '22' // 相加输出结果 '22';
			
			6 + { valueOf: function () { return 2 } } === 8
			1>. { valueOf: function () { return 2 } }.valueOf(); // 2 是primitive,返回。
			2>. 6 + 2 === 8 // 相加输出结果 8;
			
			2 + {} === '2[object Object]'
			2 + [] === '2'
			
14. 缓存机制：
		缓存位置：
			1.Service Worker：是运行在浏览器背后的独立线程，一般可以用来实现缓存功能。
				传输协议必须是HTTPS，因为Service Worker中涉及到请求拦截，所以必须使用HTTPS协议来保障安全。
				它的缓存与浏览器其他内建缓存机制不同，它可以让我们自由控制那些文件，如何匹配缓存，如何读取缓存，
				并且缓存是持续性的。
			2.Memory Cache：也就是内存中的缓存，主要包含的是当前页面中已经抓取到的资源，例如页面中已经下载的样式、
				将本、图片等。读取内存中的数据肯定比磁盘中的快，内存缓存虽然读取高效。可是缓存持续性很短，会随着进程
				的释放而释放。一旦我们关闭了Tab页面，内存中的缓存也就释放了。
				需要注意的是：内存缓存在缓存资源时并不关心返回资源的HTTP缓存头Cache-Cotrol是什么值，同时资源的匹配
				也并非仅仅是对URL做匹配，还可能会对Content-Type，CORS等其他特征做校验。
			3.Disk Cache：也就是储存在硬盘中的缓存，读取速度慢点，但是什么都能存储到磁盘中。比Memory Cahce胜在容量和存储时效上。
				在所有浏览器缓存中，Disk Cache覆盖面基本是最大的。它会更建议HTTP Header中的字段判断哪些资源需要缓存，
				哪些资源可以不请求直接使用，那些资源已经过期需要重新请求。并且及时在跨站点的情况下，相同地址的资源一旦被硬盘
				缓存下来，就不会再次去请求数据。
				总结：
					1.对于大文件来说，大概率是不存在内存中的，反之优先。
					2.当前系统内存使用率高的话，文件优先储存进硬盘。
			4.Push Cache：也就是推送缓存，是 HTTP/2 中的内容，当以上三种缓存都没有命中时，它才会被使用。它只在会话（Session）中存在，
				一旦会话结束就被释放，并且缓存时间也很短暂，在Chrome浏览器中只有5分钟左右，同时它也并非严格执行HTTP头中的缓存指令。
			
			如果以上四种缓存都没有命中的话，那么只能发起请求来获取资源了。
		缓存策略：
			强缓存：不会向服务器发送请求，直接从缓存中读取资源，在Chrome控制台的Network选项中可以看到该请求返回200的状态码，并且size显示
				from disk cache或from momery cache。强缓存可以通过设置两种HTTP Header实现： Expires和Cache-Control。
				1. Expires：缓存过期时间，用来指定资源到期时间，是服务器的具体时间点。也就是说Expires=max-age+请求时间，需要和last-modified
					结合使用。Expires是web响应头字段，在响应http请求时告诉浏览器在过期时间前浏览器可以直接从浏览器缓存取数据，而无需再次请求。 
					Expires是HTTP/1.0的产物， 受限于本地时间，如果修改了本地时间，可能会造成缓存失效。
				2. Cache-Control：用于控制网页缓存。是HTTP/1.1的产物。比如Cache-Control：max-age=300,则代表在这个请求正确返回时间（浏览器也会记录下来）的5分钟
					内再次加载资源，就会命中强缓存。
					public: 表示响应可以被客户端和代理服务器缓存。
					private：表示响应只能被客户端缓存。
					max-age=xxx：表示缓存内容将在xxx秒后失效。
					s-maxage=30：覆盖max-age和Expires header，作用和max-age一样，只在代理服务器生效。
					no-store：不缓存任何响应。既不使用强缓存，也不使用协商缓存。
					no-cache：资源被缓存，但是立即失效，下次会发起请求验证资源是否过期。
						客户端缓存内容，是否使用缓存则需要经过协商缓存来验证决定。表示不使用Cache-Control的缓存控制方式做前置验证，而是使用Etag
						或者Last-Modified字段来控制缓存。需要注意的是，no-cache这个名字有一点误导。设置了no-cache之后，并不是说浏览器就不再缓存
						数据，只是浏览器在使用缓存数据时，需要先确认一下数据是否还跟服务器保持一致。
					max-stale=30：30秒内，即使缓存过期，也使用该缓存。表示客户端愿意接受一个已经过期了的响应。如果没有指定值则最说明浏览器愿意接受任何age的响应。
					min-fresh=30：希望在30秒内获取最新的响应。能够忍受的最小新鲜度。表示客户端不愿意接受新鲜度不多于当前的age加上min-fresh设定的时间之和的响应。
				两者同时存在的话，Cache-Control优先于Expires；强缓存判断是否缓存的依据来自于是否超过某个时间段，而不关心服务器端文件是否已经更新，这可能导致加载文件
				不是服务器端最新的内容，那我们如何获知服务器端内容是否已经发生了更新尼？此时我们需要用到协商缓存策略。
			协商缓存：就是强缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程。
				协商缓存生效，返回304和Not Modified
					浏览器                   				浏览器缓存                      服务器
					  .		发起http请求	     				.							  .
					  .	----------------->						.							  .
					  .											.							  .
					  .	该请求的缓存结果失效，返回缓存标识	      .							    .
					  .	<-------------------------------		.							  .
					  .											.							  .
					  .							携带该资源的缓存标识,发起http请求	  			  .
					  .					------------------------------------------> 		  .
					  .											.							  .
					  .									304，该资源无更新 						.
					  .					<------------------------------------------	  	  	  .
					  .											.							  .
					  .			获取该请求的缓存结果				.							  .
					  .		-------------------------->			.							  .
					  .			返回该请求的缓存结果				.							  .
					  .		<--------------------------			.							  .
				协商缓存失败，返回200和请求结果。
					浏览器                   				浏览器缓存                      服务器
					.		发起http请求	     				.							  .
					.	----------------->						.							  .
					.											.							  .
					.	该请求的缓存结果失效，返回缓存标识	      .							    .
					.	<-------------------------------		.							  .
					.											.							  .
					.							携带该资源的缓存标识,发起http请求	  			  .
					.					------------------------------------------> 		  .
					.											.							  .
					.						该资源更新了，重新返回请求结果， 200				 .
					.					<------------------------------------------	 	 	  .
					.											.							  .
					.	将该请求结果和缓存标识存入浏览器缓存中		 .							  .
					.	---------------------------------->		.							  .
				协商缓存可以通过设置两种HTTP Header实现： Last-Modified和Etag。
					1. Last-Modified和If-Modified-Since
						浏览器在第一次访问资源时，服务器返回资源的同时，在response header中添加了Last-Modified的header，
						值是这个资源在服务器上的最后修改时间，浏览器接受后缓存文件及header。浏览器下次请求这个资源，浏览器检测到有Last-Modified这个
						header，于是添加If—Modified-Since这个header，值就是Last-Modified中的值；服务器再次收到这个资源请求，会根据If—Modified-Since
						中的值与服务器中这个资源的最后修改时间对比，如果没有变化，返回304和空响应体，直接从缓存读取，如果If—Modified-Since的时间小于服务器
						中这个资源的最后修改时间，说明文件有更新，于是返回新的资源文件和200。
						Last-Modified存在弊端：
							1>. 如果本地打开缓存文件，即使没有对文件进行修改，但还会造成Last-Modified被修改，服务端不能命中缓存导致发送相同的资源。
							2>. 因为Last-Modified只能以秒计时，如果在不可感知的事件内修改完成文件，name服务端会认为资源被命中，不会返回正确的资源。
					2. Etag和If-None-Match
						Etag是服务器响应请求时，返回当前资源文件的一个唯一标识（由服务器生成），只要资源有变化，Etag就会重新生成。浏览器下一次架子啊资源向
						服务器发送请求时，会将上一次返回的Etag值放到request header里面的If-None-Match里，服务器只需要比较传来的If-None-Match跟自己服务器上
						该资源的Etag是否一致，就能很好判断资源相对客户端而言是否被修改过。如果服务器发现Etag匹配不上，那么直接以常规GET 200回包形式将新资源
						（当然包括新的Etag头）发送给客户端；如果Etag是一致的，则直接返回304只会客户端直接使用本地缓存即可。
					两者对比：
						1>. 精度上，Etag要优先于Last-Modified。
						2>. 性能上，Etag逊色与Last-Modified,毕竟Last-Modified只需要记录时间，二Etag需要在服务器通过算法来急速那出来一个hash。
						3>. 优先级上，优先考虑Etag。
			强缓存优先于协商缓存进行，若强缓存（Expires和Cache-Control）生效则直接使用缓存，若不生效则进行协商缓存（Last-Modified/If-Modified-Since和Etag/If-None-Match），
			协商缓存有服务器决定是否使用缓存，若协商失败，那么代表请求的缓存失效，返回200，重新返回资源和缓存标识，再存入浏览器缓存中；生效则返回304，继续使用缓存。

			实际场景应用缓存策略：
				1.频繁变动的资源： Cache-Control:no-cache
					对于频繁变动的资源，首先使用Cache-Control： no-cache使浏览器每次都请求服务器，然后配合Etag或者Last-Modified来验证资源是否有效。
					这样做法虽然不能节省请求数量，但是能显著减小相应数据大小。
				2.不常变化的资源： Cache-Control： max-age=31536000
					通常在处理这类资源时，给他们一个Cache-Control配置一个很大的max-age-31536000（一年），这样浏览器之后请求相同的URL会命中强缓存。为了解决更新问题，
					就需要在文件名（或者路径）中加一个hash，版本号等动态字符，之后更改动态字符，从而达到更改引用URL的目的，让之前的强缓存失效（其实并非失效，只是不适用而已）。

			用户行为对浏览器缓存的影响：
				1. 打开网页，地址栏输入地址：查找disk cahce中是否有匹配。如有则使用；如没有则发送网络请求。
				2. 普通刷新（F5）：因为没有关闭Tab页，因此memory cahce是可用的，会被优先使用，其次才是disk cache。
				3. 强制刷新（Ctrl+F5）：浏览器不再使用缓存，因此发送的请求头均带有Cache-Control：no-cache（为了兼容还带有Pragma: no-cahce）,服务器直接返回200和最新的内容。

15. 跨域。
		同源策略：所谓同源是指”协议+域名+端口”三者相同，即便两个不同的域名指向同一个ip地址，也非同源。
		同源策略是一种约定，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到XSS、CSFR等攻击。
		同源策略限制内容有：
			1.Cookie、localstorage、IndexedDB等存储性内容。
			2.DOM节点
			3.ajax请求发送后，结果被浏览器拦截了。
		但是有三个标签是允许跨域加载资源的：img、link、script。
		注：跨域并不是发布出去请求，请求能发出去，服务器端能接收到请求并能正确返回结果，只是结果被浏览器拦截了。
			同时也说明了跨域并不能完全阻止CSRF，因为请求毕竟发出去了。
		跨域解决方案：
			1.jsonp: 利用script标签没有跨域限制的漏洞，网页可以得到从其他来源动态生成的json数据。jsonp请求一定需要对方的服务器做支持才可以。
				JSONP和AJAX相同，都是客户端向服务器端发送请求，从服务器端获取数据的方式。但AJAX属于同源策略，JSONP属于非同源策略（跨域请求）。
				JSONP优点是简单兼容性好，可用于解决主流浏览器的跨域数据访问的问题。缺点是仅支持get方法具有局限性,不安全可能会遭受XSS攻击。
				JSONP的实现流程：
					1).声明一个回调函数，其函数名(如show)当做参数值，要传递给跨域请求数据的服务器，函数形参为要获取目标数据(服务器返回的data)。
					2).创建一个<script>标签，把那个跨域的API数据接口地址，赋值给script的src,还要在这个地址中向服务器传递该函数名（可以通过问号传参:?callback=show）。
					3).服务器接收到请求后，需要进行特殊的处理：把传递进来的函数名和它需要给你的数据拼接成一个字符串,例如：传递进去的函数名是show，它准备好的数据是show('我不爱你')。
					4).最后服务器把准备的数据通过HTTP协议返回给客户端，客户端再调用执行之前声明的回调函数（show），对返回的数据进行操作
				function jsonp({ url, params, callback }) {
					return new Promise((resolve, reject) => {
						let script = document.createElement('script');
						window[callback] = function(data) {
							resolve(data);
							document.body.removeChild(script);
						}
						params = { ...parens, callback};
						let arrs = [];
						for (let key in params) {
							arrs.push(`${key}=${params[key]}`);
						}
						script.src = `${url}?${arrs.join('&')}`;
						document.body.appendChild(script);
					});
				}
				jsonp({
					url: 'http://localhost:3000/say',
					params: { wd: 'Iloveyou'},
					callback: 'show'
				}).then(data => {
					console.log(data);
				});
				上面这段代码相当于向http://localhost:3000/say?wd=Iloveyou&callback=show。
				jquery的jsonp：
					$.ajax({
						url:'',
						dataType:'jsonp',
						type: 'get',
						jsonCallback: 'show',
						jsonp: 'callback',
						success: function(data) {
							console.log(data);
						},
					});
			2.cors(cross-origin resource sharing):跨域资源共享是一种机制，它使用额外的HTTP头来告诉浏览器，
				让运行一个origin上的web应用被准许访问来自不同源服务器上的指定的资源。
				浏览器会自动进行cors通信，实现cors通信的关键是后端。只要后端实现了cors，就实现了跨域。
				简单请求：
					满足条件1：使用GET、HEAD或者POST方法，
					满足条件2：Content_type的值仅限于：text/plain、multipart/form-data、application/x-www-form-urlencoded。
					满足条件3：请求中的任意XMLHttpRequestUpload对象均没有注册任何事件监听器；XMLHttpRequestUpload对象可以使用XMLHttpRequest.upload属性访问。
				复杂请求：不满足简单请求的即为复杂请求。
					复杂请求的cors请求，会在正式通信之前，增加一次http查询请求，称为‘预检’请求，该请求是option方法，通过该请求来知道服务端是否允许跨域请求。
					// index.html (localhost:3000)
					let hrx = new XMLHttpRequest();
					document.cookie = 'name=along'; // cookie不能跨域
					xhr.withCredentials = true; // 前端设置是否带cookie
					xhr.open('PUT', 'http://localhost:4000/getData', true);
					xhr.setRequestHeader('name', 'along');
					xhr.onreadystatechange = function() {
						if (xhr.readyState == 4) {
							if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
								console.log(xhr.response);
								console.log(xhr.getResponseHeader('name'));
							}
						}
					}
					// server.js (localhost:4000)
					let express = require('express');
					let app = express();
					let whiteList = ['http://localhost:3000']; // 设置白名单 
					app.use(function(req,res,next) {
						let origin = req.headers.origin;
						if (whiteList.includes(origin)) {
							res.setHeader('Access-Control-Allow-Origin', origin); // 设置哪个源可以访问我
							res.setHeader('Access-Control-Allow-Header', 'name'); // 允许携带哪个头来访问我
							res.setHeader('Access-Control-Allow-Methods', 'PUT'); // 允许哪个方法访问我
							res.setHeader('Access-Control-Allow-Credentials', true); // 允许携带cookie
							res.setHeader('Access-Control-Max-Age',  86400); // 有效时间为 86400 秒，也就是24小时
							res.setHeader('Access-Control-Expose-Headers', 'name'); // 允许返回的头
							if (req.method == 'OPTION') {
								res.end(); // OPTION请求不做任何处理
							}
						}
					});

					app.put('/getData', function(req, res) {
						console.log(req.header);
						res.setHeader('name', 'jw'); // 返回一个响应头， 后台设置
						res.end('我不爱你');
					});

					app.use(express.static(__dirname));
					app.listen(4000);

					上述代码时http://localhost:3000/index.html向http://localhost:4000/ 跨域请求。正如上面所说的，后端是实现CORS通信的关键。
					IE 8 和 9 需要通过 XDomainRequest 来实现。
			3.postMessage：是HTML5 XMLHttpRequest Level 2中的API，且是为数不多可以跨域操作的window属性之一。
				它可用于解决以下方面的问题：
					1.页面和其打开的新窗口的数据传递。
					2.多窗口之间消息传递。
					3.页面与嵌套的iframe消息传递。
					postMessage(message, targetOrigin, [transfer])方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递。
						message：将要发送到其他 window的数据。
						targetOrigin：通过窗口的origin属性来指定哪些窗口能接收到消息事件，其值可以是字符串”*”（表示无限制）或者一个URI。
						transfer(可选)：是一串和message 同时传递的 Transferable 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。
					
					// a.html (localhost:3000)
					<iframe src="http://localhost:4000/b.html" frameborder="0" id="frame" onload="load()"></iframe>
					<script>
						function load() {
							let frame = document.getElementById('frame');
							frame.contentWindow.postMessage('我爱你', 'http://localhost:4000'); //发送数据
							window.onmessage = function(e) { //接受返回数据
								console.log(e.data);
							}
						}
					</script>
					// b.html (localhost:4000)
					window.onmessage = function(e) {
						console.log(e.data);
						e.source.postMessage('我不爱你'， e.origin);
					}
					以上代码实现 http://localhost:3000/a.html页面向http://localhost:4000/b.html传递“我爱你”,然后后者传回”我不爱你”。
			4.Node中间件代理（两次跨域）：同源策略是浏览器需要遵守的标准，而如果是服务器向服务器请求就无需遵循同源策略了。
				// index.html(http://127.0.0.1:5500)
 				<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
				<script>
					$.ajax({
						url: 'http://localhost:3000',
						type: 'post',
						data: { name: 'xiamen', password: '123456' },
						contentType: 'application/json;charset=utf-8',
						success: function(result) {
						console.log(result) // {"title":"fontend","password":"123456"}
						},
						error: function(msg) {
						console.log(msg)
						}
					})
				</script>
				// server1.js 代理服务器(http://localhost:3000)
				const http = require('http');
				// 第一步：接受客户端请求
				const server = http.createServer((req, res) => {
					// 与浏览器直接对接 跨域需要设置CORS 的首部字段
					response.writeHead(200, {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': '*',
						'Access-Control-Allow-Headers': 'Content-Type',
					});
					// 第二步：将请求转发给服务器
					const proxyRequest = http.request({
						host: '127.0.0.1',
						port: '4000',
						url: '/',
						method: req.method,
						headers:req.headers,
					}, serverResponse => {
						// 第三步：收到服务器的响应
						let body = '';
						serverResponse.on('data', chunck => {
							body += chunck;
						});
						serverResponse.on('end', () => {
							// 第四步：将响应结果转发给浏览器
							console.log('The data is'+ body);
							res.end(body);
						})
					});
				});
				server.listen(3000, () => {
					console.log('The proxyServer is running at http://localhost:3000')
				})
				// server2.js(http://localhost:4000)
				const http = require('http');
				const data = { title: 'fontend', password: '123456' };
				const server = http.createServer((req, res) => {
					if (req.url === '/') {
						response.end(JSON.stringify(data));
					}
				});
				server.listen(4000, () => {
					console.log('The server is running at http://localhost:4000')
				})
				以上代码实现本地文件(localhost:5500)index.html文件，通过代理服务器http://localhost:3000向目标服务器http://localhost:4000请求数据。
		5.window.name + iframe: window.name属性的独特之处：name值在不同的页面（甚至不同域名）加载后依旧存在，并且可以支持非常长的 name 值（2MB）。
			 // a.html(http://localhost:3000/b.html)
			 <iframe src="http://localhost:4000/c.html" frameborder="0" onload="load()" id="iframe"></iframe>
			 <script>
				let first = true;
				function load() {
					if (first) {
						let iframe = document.getElementById('iframe');
						iframe.src = "http://localhost:3000/b.html";
						first = false;
					} else {
						console.log(iframe.contentWindow.name);
					}
				}
			 </script>
			 // c.html(http://localhost:4000/c.html)
			 <script>
				window.name = '我不爱你';
			 </script>
			以上代码a.html和b.html是同域的，都是http://localhost:3000;而c.html是http://localhost:4000
			通过iframe的src属性由外域转向本地域，跨域数据即由iframe的window.name从外域传递到本地域。
			这个就巧妙地绕过了浏览器的跨域访问限制，但同时它又是安全操作。
		6.window.hash + iframe: a.html欲与c.html跨域相互通信，通过中间页b.html来实现。 三个页面，不同域之间利用iframe的location.hash传值，相同域之间直接js访问来通信。
			// a.html
			<iframe src="http://localhost:4000/c.html#iloveyou"></iframe>
			<script>
				window.onhashchange = function () { //检测hash的变化
				console.log(location.hash);
				}
			</script>
			// b.html
			<script>
				window.parent.parent.location.hash = location.hash;  //b.html将结果放到a.html的hash值中，b.html可通过parent.parent访问a.html页面
			</script>
			// c.html
			console.log(location.hash);
			let iframe = document.createElement('iframe');
			iframe.src = 'http://localhost:3000/b.html#idontloveyou';
			document.body.appendChild(iframe);
			一开始a.html给c.html传一个hash值，然后c.html收到hash值后，再把hash值传递给b.html，最后b.html将结果放到a.html的hash值中。
		7.window.domain + iframe:给页面添加 document.domain ='test.com' 表示二级域名都相同就可以实现跨域。
			该方式只能用于二级域名相同的情况下，比如 a.test.com 和 b.test.com 适用于该方式。
			// a.html
			<iframe src="http://b.zf1.cn:3000/b.html" frameborder="0" onload="load()" id="frame"></iframe>
			<script>
				document.domain = 'zf1.cn'
				function load() {
				console.log(frame.contentWindow.a);
				}
			</script>
			// b.html
			<script>
				document.domain = 'zf1.cn'
				var a = 100;
			</script>
			以上代码实现页面a.zf1.cn:3000/a.html获取页面b.zf1.cn:3000/b.html中a的值。
		8.nginx反向代理：实现原理类似于Node中间件代理，需要你搭建一个中转nginx服务器，用于转发请求。

16. forEach、map等中的函数是同步的，for是异步的。
	async function getFoo(ms) {
      return new Promise((resolve) => {
        console.log(`${new Date().getSeconds()}_${ms}`);
        setTimeout(() => {
          resolve('timeout_getFoo');
        }, ms);
      });
    }
    function dbFuc1() { // 同步
      const docs = [8000, 5000, 1000, 2000, 3000];
      docs.forEach(async (doc) => {
        await getFoo(doc);
      });
    }
    /* eslint-disable */
    async function dbFuc2() { // 异步
      const docs = [8000, 5000, 1000, 2000, 3000];
      for (const doc in docs) {
        await getFoo(docs[doc]);
      }
	}

	// 异步函数不应该用直接循环，不然项目的执行顺序是不确定的。应该用递归
	const docs = [8000, 5000, 1000, 2000, 3000];
    (function loop(index) {
      setTimeout(function() { // 用setTimeout模拟异步函数
        console.log(`${new Date().getSeconds()}_${docs[index]}`);
        if (++index < docs.length) {
          loop(index);
        } else {
          console.log('全部执行完毕');
        }
      }, docs[index]);
    })(0);

16.JSON(JavaScript Object Notation):js对象记法-指的是将Object以文本的方式给记录下来。(显而易见就是字符串)
	JSON与js对象的联系：
		1.JSON是基于js的一种格式，而js对象是一个实例，是存在于内存中的一个东西
		2.JSON是可以传输的，因为他是文本格式，但js对象是没办法传输的
		3.JSON在语法上更加严格，js对象很轻松。譬如，键名必须加双引号，属性值不能是函数，最后一个属性后面不能有逗号
		var obj1 = {}; // 这只是 JS 对象
		var obj2 = {"width":100,"height":200,"name":"rose"}; // 可把这个称做：JSON 格式的 JavaScript 对象
		var str1 = '{"width":100,"height":200,"name":"rose"}'; // 可把这个称做：JSON 格式的字符串
		var arr = [  // 这个可叫 JSON 格式的数组，是 JSON 的稍复杂一点的形式
			{"width":100,"height":200,"name":"rose"},
			{"width":100,"height":200,"name":"rose"},
			{"width":100,"height":200,"name":"rose"},
		];
		var str2='['+  // 这个可叫稍复杂一点的 JSON 格式的字符串   
			'{"width":100,"height":200,"name":"rose"},'+
			'{"width":100,"height":200,"name":"rose"},'+
			'{"width":100,"height":200,"name":"rose"},'+
		']';
	JSON.stringify(value[, replacer [, space]]):将JS数据结构转化为JSON字符串
		value:js数据结构。
		replacer:如果是函数，那么序列化过程中的每个属性都白这个函数处理；如果是数组，那么只有包含在数组里的属性才会被序列化到JSON字符串中
		space:转化为JSON字符串缩进用的空白字符；如果是数字就表示空格的个数，如果是字符串就表示用该字符串代替空格
		注意点：
			1.键名不是双引号的（包括没有引号或者是单引号），会自动变成双引号；字符串是单引号的，会自动变成双引号
			2.最后一个属性后面有逗号的，会被自动去掉
			3.非数组对象的属性不能保证以特定的顺序出现在序列化后的字符串中。这个好理解，也就是对非数组对象在最终字符串中不保证属性顺序和原来一致
			4.布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值,也就是你的什么new String("bala")会变成"bala"，new Number(2017)会变成2017
			5.undefined、任意的函数（其实有个函数会发生神奇的事，后面会说）以及 symbol 值（symbol详见ES6对symbol的介绍）
				出现在非数组对象的属性值中：在序列化过程中会被忽略
				出现在数组中时：被转换成 null
			6.NaN、Infinity和-Infinity，不论在数组还是非数组的对象中，都被转化为null
			7.所有以 symbol 为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们
			8.不可枚举的属性会被忽略
		例：
		var obj = { a: 1, b: 2 }
		var objJson = JSON.stringify(obj) // '{"a":1,"b":2}'
		var objJson = JSON.stringify(obj, ['a']) // '{"a":1}'
		var objJson = JSON.stringify(obj, (key, value) => {
			console.log(key, value)
			if (value === 2) {
				return 4
			} else {
				return value
			}
		}) // '{"a":1,"b":4}'
		var objJson = JSON.stringify(obj, null, 1)
		// {
		// 	"a": 1,
		// 	"b": 2
		// }
		var objJson = JSON.stringify(obj, null, '___')
		// {
		// ___"a": 1,
		// ___"b": 2
		// }
		console.log(objJson)

		// var res = JSON.stringify({x: undefined, y: function(){return 1}, s: Symbol('123'), a: '123'}) // '{"a":"123"}'
		// var res = JSON.stringify([undefined, function y (){return 1}, Symbol('123'), '123']) // '[null,null,null,"123"]'
		var res = JSON.stringify(12) // "12"
		var res = JSON.stringify(new Number(123)) // "12"
		var res = JSON.stringify('12') // '"123"'
		console.log(res)
	JSON.parse(text[, reviver])：将JSON字符串解析为JS数据结构
		text:JSON字符串
		reviver: 这个参数必须是一个函数，这个函数作用在属性已经被解析但是还没返回前，将属性处理后再返回
		var friend={  
			"firstName": "Good",
			"lastName": "Man",
			"phone":{"home":"1234567","work":["7654321","999000"]}
		};
		var friendJSON = JSON.stringify(friend);
		console.log(friendJSON)
		var friend1 = JSON.parse(friendJSON, function(k, v) {
			console.log(k);
			console.log(v);
			console.log("----");
			if (k === 'home') return '18898563651'
			return v
		})
		console.log('=>',friend1)

17. forEach与for的区别
	for遍历的特性：
		1.for在遍历的时候可以更改i的值
			var arr = ['a','b','c','d','b','e','f','g','h']
			for (var i = 0; i < arr.length; i++) {
				console.log('index:', i, ';value:', arr[i])
				if (arr[i] === 'b') {
					arr.splice(i, 1)
					i--
				}
			}
			console.log(arr)
		2.直接在for循环中使用return会报错，函数中使用for可以return
			// 直接在for中使用return会报错
			var arr = ['a','b','c','d','b','e','f','g','h']
			for (var i = 0; i < arr.length; i++) {
				console.log('index:', i, ';value:', arr[i])
				if (arr[i] === 'b') {
					arr.splice(i, 1)
					i--
				}
				return 'hahha' // Uncaught SyntaxError: Illegal return statement
			}
			// 函数中for return
			function fn() {
				for (var i = 0; i < arr.length; i++) {
					console.log('index:', i, ';value:', arr[i])
					if (arr[i] === 'b') {
						arr.splice(i, 1)
						i--
					}
					return 'hahha'
				}
			}
			fn()
		3.for可以使用break跳出循环
			var arr = ['a','b','c','d','b','e','f','g','h']
			for (var i = 0; i < arr.length; i++) {
				console.log('index:', i, ';value:', arr[i])
				if (arr[i] === 'b') {
					arr.splice(i, 1)
					i--
				}
				break
			}
	forEach遍历的特性：
		// 3.不可以重置i和v
			var arr = ['a','b','c','d','b','e','f','g','h']
			arr.forEach((v, i) => {
				console.log('index:', i, ';value:', arr[i])
				if (arr[i] === 'b') {
					arr.splice(i, 1)
					i-- // i会在forEach哈数内部自增，在回调中更改不了
				}
			})
			console.log(arr)
		1.可以使用return，但rerutn并不会生效
			var arr = ['a','b','c','d','b','e','f','g','h']
			arr.forEach((v, i) => {
				console.log('index:', i, ';value:', arr[i])
				return 'haha'
			})
			console.log(arr)
		2.不可以使用break跳出循环
			var arr = ['a','b','c','d','b','e','f','g','h']
			arr.forEach((v, i) => {
				console.log('index:', i, ';value:', arr[i])
				break // Uncaught SyntaxError: Illegal break statement
			})
			console.log(arr)
	
	如何跳出forEach遍历
		1.改写forEach方法
			Array.prototype.forEach = function(callback) {
				var i = 0;
				while (i < this.length) {
					var ret = callback.call(this, this[i], i, this)
					if (typeof ret !== 'undefined' && (ret === null || ret === false)) break
					i++
				}
			}

			var arr = ['a','b','c','d','b','e','f','g','h']
			arr.forEach((v, i) => {
				console.log(v)
				if (v === 'e') {
					return false
				}
			})
		2.利用异常的方式来跳出forEach循环
			var arr = ['a','b','c','d','b','e','f','g','h']
			try {
				arr.forEach((v, i) => {
					console.log(v)
					if (v === 'e') {
						throw new Error('StopIteration')
					}
				})
			} catch (err) {
				
			}
			console.log(arr)

	18.浏览器节点调试：打开控制台->Elements栏点中节点->console栏输入$0 获取节点