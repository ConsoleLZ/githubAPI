---
title: 网页游戏制作，phaser制作4399小游戏
date: 2024-10-09
tags:
   - phaser
categories:
   - 前端进阶
---

## 前言

相信家人们都玩过4399小游戏吧，那你会不会好奇，如何在浏览器环境中做一款小游戏呢，这里作者就用phaser来教大家如何控制角色上下左右移动

phaser官网：[Phaser - A fast, fun and free open source HTML5 game framework](https://phaser.io/)
感兴趣的可以自己深入研究学习哦，这里作者只做一个基础的角色控制演示

大家坐好，准备发车了！

![1692775737511980.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/3829fdd592a5485786c8460bf75d6049~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5bCP5ZOy:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTI5NTY5MjczMjA1MzI0MSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1729403814&x-orig-sign=lMbfHjnfKFg1%2Fkg5DtENADO4b%2Bg%3D)

## 预览

![123.gif](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/a1f08e5bb31b4b65b5aa1461335e0aa5~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5bCP5ZOy:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTI5NTY5MjczMjA1MzI0MSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1729403814&x-orig-sign=mFNWrKaZHHm2a%2BsA5%2BvzyHjzJBA%3D)

## phaser环境搭建

这里作者就不用npm了，直接引入的cdn

``

这样没有代码提示（有没有大佬知道代码提示插件的，市面上的插件好像都有bug，可能太久没更新了🤔），你也可以使用npm，作者就是图个方便，好了废话不说了，反正环境搭建非常简单，你随便发挥，哈哈哈哈

## 素材准备

这里使用的是一张宝可梦中角色的精灵图（从小就喜欢），大家也可以直接自己随便找一张这种关键帧的精灵图，想要作者的素材的，我也非常贴心的上传了（仅供学习使用）：

链接:
提取码:dj8m

## 游戏场景初始化

```js
const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: 'game',
            backgroundColor: '#efefef',
            scene: {
                preload: preload,
                create: create,
                update: update
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: false
                },
            }
        };

        const game = new Phaser.Game(config);
```

config属性说明：

1.  type: 指定渲染器类型。`Phaser.AUTO` 会自动选择最适合的渲染方式（通常是WebGL，如果浏览器不支持则回退到Canvas）
2.  parent: 指定一个DOM元素ID，作为游戏画布的父容器
3.  scene: 定义了场景相关的配置，包括预加载资源、创建游戏世界和更新逻辑的方法
    *   preload: 用于加载游戏所需的资源（如图片、音频等）。这是一个函数引用，实际的加载逻辑需要在对应的函数中实现
    *   create: 在这个阶段，你可以初始化游戏对象、设置初始状态等
    *   update: 游戏循环中的每一帧都会调用此方法。通常在这里处理游戏逻辑、物理模拟、玩家输入等
4.  physics: 配置物理引擎相关选项
    *   default: 指定默认使用的物理引擎。这里设置为`'arcade'`，即Phaser内置的简化版物理引擎
    *   arcade: 进一步配置Arcade物理引擎的行为,gravity设置为false表示禁用全局重力

## preload函数

这里主要是加载资源文件

```js
function preload() {
    this.load.spritesheet({
        key: 'role',
        url: 'assets/role.png',
        frameConfig: {
            frameWidth: 64,
            frameHeight: 64,
        }
    });

}
```

说明:

1.  key: 这是一个字符串，作为这个精灵图的唯一标识符。在游戏的其他部分，你可以通过这个键来引用这个精灵图
2.  frameConfig: 这个对象定义了精灵图中每个帧（即每个小图片）的尺寸。这对于正确解析和显示精灵图中的各个部分非常重要

## create

这里做的就是将资源进行解析，变成一个一个的精灵动画，就是角色上下左右移动的动画

```js
function create() {
    player = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'role');
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('role', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('role', { start: 4, end: 6 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('role', { start: 8, end: 10 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('role', { start: 12, end: 14 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idle_up',
        frames: [{ key: 'role', frame: 1 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'idle_right',
        frames: [{ key: 'role', frame: 5 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'idle_down',
        frames: [{ key: 'role', frame: 9 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'idle_left',
        frames: [{ key: 'role', frame: 13 }],
        frameRate: 20
    });
}

```

说明:

1.  `this.physics.add.sprite(x, y, textureKey)`: 创建一个带有物理属性的精灵。`x` 和 `y` 是精灵的初始位置，这里设置为窗口宽度和高度的一半，使角色居中显示。`textureKey` 是在 `preload` 中加载的精灵图的键名
2.  `player.setCollideWorldBounds(true)`: 设置玩家角色与世界边界碰撞时的行为。`true` 表示当玩家角色碰到世界边界时会停止移动。
3.  `this.anims.create(config)`: 创建一个新的动画
4.  `frames`: 定义动画帧。使用 `this.anims.generateFrameNumbers` 方法来生成一系列帧编号。`start` 和 `end` 参数指定了起始帧和结束帧的索引。例如，`{ start: 0, end: 2 }` 表示从第0帧到第2帧
5.  `frameRate`: 每秒播放的帧数。这里设置为 `10`，意味着每秒播放10帧
6.  `repeat`: 动画是否重复播放。`-1` 表示无限循环

## update函数

这里就是控制动画如何运行的，比如人物按下哪个键向上移动等操作

```js
// 挂机时人物的朝向
let action_type = 'idle_down'
// 角色的移动速度
const velocity = 160
function update() {
    const cursors = this.input.keyboard.createCursorKeys();
    // 默认情况下，停止所有方向上的运动
    player.setVelocityX(0);
    player.setVelocityY(0);
    switch (true) {
        case cursors.up.isDown:
            player.anims.play('up', true);
            player.setVelocityY(-velocity);
            action_type = 'idle_up'
            break;
        case cursors.right.isDown:
            player.anims.play('right', true);
            player.setVelocityX(velocity);
            action_type = 'idle_right'
            break;
        case cursors.down.isDown:
            player.anims.play('down', true);
            player.setVelocityY(velocity);
            action_type = 'idle_down'
            break;
        case cursors.left.isDown:
            player.anims.play('left', true);
            player.setVelocityX(-velocity);
            action_type = 'idle_left'
            break;
        default:
            player.anims.play(action_type, true);
    }
}
```

## 完整代码

```html




    
    
    
    
    



    


    



```
测试