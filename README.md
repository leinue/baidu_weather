# baidu_weather

Puzzle-3 天气 Webapp

Designed and Developed By 谢扬

实现的功能：

1. 根据浏览器定位
2. 若浏览器不支持定位则使用ip定位
3. 若ip定位失败则用户自己选择城市
4. 未来4天天气预测
5. 5天天气的折线统计图

![](http://i1.piimg.com/567571/6a3bb16606392657.png)

# 示例

建议使用chrome、火狐、safari访问，ie、edge未测（osx系统，无windows）。

[点击访问](http://weather.poimoe.com/ "示例")

# 目录说明

1.src目录下为托管app的页面（为了在PC上访问方便）
2.weapp目录下为天气APP程序

# 运行说明

## 主页面

### 调试

``` shell
gulp serve
```

### 构建

``` shell
gulp build
```

## 天气app

### 调试

``` shell
npm run dev
```

### 构建

``` shell
npm run build
```