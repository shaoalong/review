module.exports = {
    extends: 'stylelint-config-standard',
    rules: {
      'block-opening-brace-space-before': 'always', // 选择器和 { 之间必须（MUST）保留一个空格
      'declaration-empty-line-before': 'never', // 冒号前不得（MUST NOT）保留空格
      'function-comma-space-after':'always-single-line', // 在用逗号（ , ）分隔的列表（Less 函数参数列表、以 , 分隔的属性值等）中，逗号后必须（MUST）保留一个空格
      'function-comma-space-before': 'never-single-line', // ，逗号前不得（MUST NOT）保留空格。
      'function-calc-no-unspaced-operator': true, // + / - / * / / 四个运算符两侧必须（MUST）保留一个空格
      'selector-list-comma-newline-after': 'always', // 当多个选择器共享一个声明块时，每个选择器声明必须（MUST）独占一行。
      'shorthand-property-no-redundant-values': true, // 使用缩写属性时已最简的方式赋值
      'declaration-block-no-redundant-longhand-properties': true, // 多个属性定义可以使用缩写时， 尽量（SHOULD）使用缩写。缩写更清晰字节数更少。
      'number-leading-zero': 'always', //对于处于 (0, 1) 范围内的数值，小数点前的 0不可省略
      'length-zero-no-unit': true, // 当属性值为 0 时，必须（MUST）省略单位（长度单位如 px 、 em ，不包括时间、角度等如 s 、 deg ）。
      'color-hex-case': 'lower', // 颜色定义必须（MUST）使用 #rrggbb 格式定义，并在可能时尽量（SHOULD）缩写为 #rgb 形式，且避免直接使用颜
      'color-named': 'never', //色名称与 rgb() 表达式
      'color-hex-length': 'short',
      'indentation': 2, //必须（MUST）采用 2 个空格为一次缩进， 不得（MUST NOT）采用 TAB 作为缩进。
      'string-quotes': 'double', // 字符串两侧的引号必须（MUST）使用"
      'selector-pseudo-element-colon-notation': 'single', // 伪类使用单冒号
      'block-no-empty': null,
      'color-no-invalid-hex': true, // 不允许出现不合法的16进值颜色值
      'comment-empty-line-before': [ 'always', { // 注释前必须出现空行
        'ignore': ['stylelint-commands', 'after-comment'],
      } ],
      'declaration-colon-space-after': 'always', // 属性名后的冒号（ : ）与属性值之间必须（MUST）保留一个空格
      'max-empty-lines': 2, //最大空行数为2
      'rule-empty-line-before': [ 'always', {//css或less规则的最后必须出现空行
        'except': ['first-nested'],
        'ignore': ['after-comment'],
      } ],
      // 允许的单位
      'unit-whitelist': ['em', 'rem', '%', 's', 'ms', 'px', 'deg'],//允许的单位
      'function-comma-newline-after': 'never-multi-line', //函数参数多行的情况下，参数逗号后不允许出现空白字符
      'function-comma-newline-before': 'never-multi-line',//函数参数多行的情况下，参数逗号前不允许出现空白字符
      'no-empty-source': null //关闭no-empty-source规则
    },
    syntax: 'less|scss',
    processors: ['stylelint-processor-html']
  };
  