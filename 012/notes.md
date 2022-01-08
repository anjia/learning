### 一、发布系统

包含三个子系统：

1. 线上服务系统：给真正的用户提供线上服务
2. 发布系统：程序员向“线上服务系统”发布代码（可以单机同级部署，也可以在不同集群）
   - 单机同级部署发布系统
3. 发布工具：和“发布系统”对接的命令行工具

步骤：

1. 服务器 Server。可以选择：
   - Oracle 的 VirtualBox 虚拟机
   - 真实的服务器：阿里云
     - 系统 Linux
     - 版本：Ubuntu [ʊˈbʊntuː]
   - 安装好：node+npm
     - 包管理工具 apt
     - `sudo npm install -g n` Node 写的一个 Node 的版本管理的包
2. 写代码 Server 端
   - 任务：跑一个服务，然后把代码部署到服务器上（不包括错误恢复、线上重启、监控等）
   - 前端就直接发布 HTML 代码即可，即前后端完全分离（暂不考虑前后端混合部署的情况）
     - 这里用 express 框架搞个 `npx express-generator`。
3. 把代码部署到服务器端
   - 在服务器上装 OpenSSH 这个包（比如可以 `apt install` 这个包）
   - 在服务器上 `service ssh start` 启动 ssh，它会默认监听 22 端口
     - 这样我们就能远程登录到服务器上了
     - 或者若用虚拟机，则需要将 22 端口给到虚拟机（在端口转发那设置）
   - ssh 既可以远程登录，又可以传文件。`scp`命令
4. 发布服务：发布的服务器端+发布工具
   - publish-server（服务端） 向我们真实的服务器 copy 文件
   - publish-tool（客户端）
     - tool 向 server 发送文件，“流式传输”
5. 更多
   - 先实现了个单文件的传输：文件-HTTP-HTTP-文件的流式传输
   - 再实现多文件：压缩+解压
     - readable.pipe 将一个可读的流导入一个可写的流里
   - 至此：
     - 发布工具-发布系统-线上服务系统
     - 部署发布系统
     - publish-tool 登录鉴权-打包等, eg.github 的 oAuth

```sh
# 将 8022 端口下，本目录的所有资源，复制到虚拟机 username@127.0.0.1 上（后面跟的是路径）
# 宿主机的 8022 端口，会被转发到虚拟机上的 22 端口（冒号:后跟的是路径）
# -P端口 -r递归
scp -P 8022 -r ./* username@127.0.0.1:/home/username/server
scp -r ./* xxx@xx.xx.xx.xx:/home/xxx/learn/server
# 可以将node_modules一起拷过去（避免不遵循semantic version原则）
# 也可以用package-lock.json
```

> 虚拟机上配置的端口映射：
> Host Port -> Guest Port
>
> - 8022, 22
> - 8080, 3000
>   这样就可以通过 localhost 来访问虚拟机上的端口了

#### Node 里面的流 stream (\*)

- 可读的流 [stream.Readable](https://nodejs.org/api/stream.html#class-streamreadable)
  - data
  - close
- 可写的流 [stream.Writable](https://nodejs.org/api/stream.html#class-streamwritable)
  - writable.write
- 可读可写的流

> HTTP 本身设计的就是可以携带大型数据的
> 它的 Content-Type 可以看 HTTP 的 RFC 标准

### 二、持续集成

> 发布前的检查

持续集成，两个概念（客户端）：

- daily build（客户端的代码，全局 build 一次成本比较高，所以半夜的时候 build 一次）
- BVT, build verification test, 构建的验证测试\~冒烟测试（都是最基本最简单的测试）

持续集成（前端）：build 一次几十秒\~两三分钟，可以在提交的时候进行一次验证。
对于前端这种短周期的开发，专门的测试显得有些过重。所以前端采用一种更轻量级的检查方式，比如 lint（代码风格和模式）、比较完整的测试（无头浏览器-检查 DOM，eg.性能上的-图片过大/图片面积和质量不成比例）

1. 通过 git hooks 来完成检查的时机
2. ESLint 非常轻量级的代码检查方案
3. Chrome 的 Headless 模式
   - 旧的解决方案：PhotomJS 基于无头浏览器检查代码最后生成出来的样子，eg.规则

#### 1. git hooks

[git](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

- 客户端
  - pre-commit（eslint）
  - pre-push （check）
- 服务器
  - pre-receive

```sh
# .git/hooks/, 去掉后缀.sample便可以执行了（就是linux的可执行文件了
applypatch-msg.sample
commit-msg.sample
fsmonitor-watchman.sample
post-update.sample
pre-applypatch.sample
pre-commit.sample
pre-push.sample
pre-rebase.sample
pre-receive.sample
prepare-commit-msg.sample
update.sample

# 权限如下
-rw-r--r--  1 anjia  staff     0B Jan  8 11:22 pre-commit
-rwxr-xr-x  1 anjia  staff   1.6K Jan  8 11:05 pre-commit.sample

# 执行文件
pre-commit    # zsh: command not found: pre-commit
./pre-commit  # zsh: permission denied: ./pre-commit
# chmod +x pre-commit
-rwxr-xr-x  1 anjia  staff     0B Jan  8 11:22 pre-commit
-rwxr-xr-x  1 anjia  staff   1.6K Jan  8 11:05 pre-commit.sample
```

- git hooks：客户端检查（辅助工具）
- web hooks：服务端检查（强制标准）

#### 2. ESLint

```sh
npm init
npm install --save-dev eslint
npx eslint --init
npx eslint ./index.js
```

```sh
git stash push
git stash list
git stash pop # 两次更改被合并了..
git stash push -k # 加选项 -k
git stash pop
```

#### 3. Chrome 的 Headless 模式

[Getting Started with Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome?hl=en)

```sh
alias chrome="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
chrome
chrome --headless
chrome --headless --dump-dom about:blank
chrome --headless --dump-dom about:blank > tmp.txt
```

[puppeteer](https://www.npmjs.com/package/puppeteer)

```sh
npm i puppeteer
```

> 也可以单元测试（涉及 DOM 的）但是有点略重
