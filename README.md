# react-native-svg-icons
渲染svg制作的iconfont。基于[react-native-svg-uri](https://github.com/vault-development/react-native-svg-uri)改造，依赖[react-native-svg](https://github.com/react-native-community/react-native-svg)。


通过 `npm` 或者 `yarn` 安装依赖

```bash
yarn add react-native-svg react-native-svg-icons
```

Link  react-native-svg 包

```bash
react-native link react-native-svg # not react-native-svg-icons !!!
```

## Props

| Prop | Type | Default | Note |
|---|---|---|---|
| `icon` | `String` |  | icon的名称，必填
| `color` | `Color` |  | icon的填充颜色，选填
| `size` | `Number` |  | icon的大小，选填
| `style` | `Object` |  icon的样式
| `value` | `String` |  icon的唯一标识



## <a name="Usage">使用</a>

简单实例示例:

```javascript
// 使用内置Icon时仅需引用Icon即可，自定义时引入createIconSet
import Icon, { createIconSet } from 'react-native-svg-icons'
// 包含业务svg的js文件
import svgs from './Icon/svgs' // 仅自定义时引入，svgs通过工具生成
// 传入业务svg的js对象，生成CIcon组件
const CIcon = createIconSet(svgs) // 仅自定义时使用

// 使用时icon为必传字段，value实际为key，不传时默认为icon所传
// 使用时CIcon为单标签，且表现为独占一行，需配合flex布局使其展现为行内
// 使用时受svg源的影响，表现大小不一，当size不合适时只显示部分，目前可通过设置transform样式进行hack
<Icon style={{padding: 10}} icon={'location'}   value={'location'} size={50} color={'#faebd7'} />
// 如star size为40时展示不全
<CIcon style={{transform:[{scale:0.5}]}} icon={'star'} size={80} color={'#FDF24A'} />
```

输出内置svg:

```javascript
import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import Icon from 'react-native-svg-icons'
import svgs from './node_modules/react-native-svg-icons/svgs'

class IconBox extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{flexDirection: 'column',justifyContent: 'center',alignItems: 'center',}}>
        <Icon style={{flex:1}} icon={this.props.icon}   value={this.props.value} />
        <Text style={{flex:1}}>{this.props.icon}</Text>
      </View>
    )
  }
}

export default class SvgIcon extends Component {
  render() {
    return (
      <ScrollView >
          <View style={{flex:1,flexDirection: 'row',flexWrap: 'wrap',}}>
          {
            Object.keys(svgs).map((item, index) => (
              <IconBox icon={item}  key={index} value={index} />
            ))
          }
          </View>
      </ScrollView>
    );
  }
}

```

This will render:

![Component example](./screenshoots/sample.png)

## <a name="GetSvg">生成svgs.js</a>
svgs.js是通过[svg2json](https://github.com/gpdife/svg2json.git)的npm包生成的，大概原理是遍历Icon文件夹下的svg文件，合并生成svgs.js。
核心源码：
```javascript
const fs = require('fs')
const path = require('path')

// 读取单个文件
function readfile(inDir, filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(inDir, filename), 'utf8', function (err, data) {
      if (err) {
        reject(err)
      }
      resolve({
        [filename.slice(0, filename.lastIndexOf('.'))]: data.replace(/<\?xml.*?\?>|<\!--.*?-->|<!DOCTYPE.*?>/g, ''),
      })
    })
  })
}

// 读取SVG文件夹下所有svg
function readSvgs(inDir) {
  return new Promise((resolve, reject) => {
    fs.readdir(inDir, function (err, files) {
      if (err) {
        reject(err)
      }
      Promise.all(files.map(filename => readfile(inDir, filename)))
        .then(data => resolve(data))
        .catch(err => reject(err))
    })
  })
}

module.exports = function (inDir, outFile) {
  const cwd = process.cwd()
  inDir = path.join(cwd, inDir, '/')
  outFile = path.join(cwd, outFile)
  // 生成js文件
  readSvgs(inDir)
    .then(data => {
      let svgFileString = 'export default ' + JSON.stringify(Object.assign.apply(this, data))
      fs.writeFile(outFile, svgFileString, function (err) {
        if (err) {
          throw new Error(err)
        }
        console.log('success!')
      })
    }).catch(err => {
      throw new Error(err)
    })
}
```
