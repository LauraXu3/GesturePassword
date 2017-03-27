## 手势密码插件

>参考手机开锁时的界面

## 使用

```
1.下载c文件
2.在html文件中引入<script src="https://github.com/LauraXu3/GesturePassword.git"></script>
3.创建GestruePwd实例，传入包裹手势密码界面的container节点，调用init()方法
var container = document.getElementsByClassName('gesture')[0];
var gesturePwd = new GesturePwd(container);
gesturePwd.init();
```