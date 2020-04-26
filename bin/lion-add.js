#!/usr/bin/env node

// 交互式命令行
const inquirer = require('inquirer')
// 修改控制台字符串的样式
const chalk = require('chalk')
const ora = require('ora')
const download = require('download-git-repo')
const fs = require('fs')
// const program = require('commander')
// 读取根目录下的 template.jso
// program.option()
// 自定义交互式命令行的问题及简单的校验
let question = [
  {
    name: "projectName",
    type: 'input',
    message: "请输入项目名称"
  },
  {
    name: "description",
    type: 'input',
    message: "请输入项目描述"
  },
  {
    name: "projectUrl",
    type: 'list',
    message: "请选择项目",
    choices: [
      {
        name: 'micro-module(微前端模块-基于vue)',
        value: 'https://git.qutoutiao.net:insurance/module-demo'
      },
      {
        name: 'micro-module-react(微前端模块-基于react)',
        value: 'react'
      }
    ]
  }
]

inquirer
  .prompt(question).then(answers => {
    // answers 就是用户输入的内容，是个对象
    const { projectUrl, projectName } = answers
    console.log(chalk.white('\n Start generating... \n'))
    // 出现加载图标
    const spinner = ora("Downloading...");
    spinner.start();
    // 执行下载方法并传入参数
    download(
      projectUrl,
      projectName,
      { clone: true },
      err => {
        if (err) {
          spinner.fail();
          console.log(chalk.red(`Generation failed. ${err}`))
          return
        }
        fs.readFile(`${process.cwd()}/${projectName}/src/App.vue`, 'utf-8', (err, data) => {
          if (err) console.log(err)
          let result = data.replace(/test/g, projectName)
          fs.writeFile(`${process.cwd()}/${projectName}/src/App.vue`, result, 'utf-8', (err) => {
            if (err) return console.log(err)
          })
        })
        fs.readFile(`${process.cwd()}/${projectName}/src/router/index.js`, 'utf-8', (err, data) => {
          if (err) console.log(err)
          let result = data.replace(/test/g, projectName)
          fs.writeFile(`${process.cwd()}/${projectName}/src/router/index.js`, result, 'utf-8', (err) => {
            if (err) return console.log(err)
          })
        })
        // 结束加载图标
        spinner.succeed();
        console.log(chalk.green('\n Generation completed!'))
        console.log('\n to get started')
        console.log(`\n cd ${projectName} \n`)
        console.log('先看readme文件再食用哦')
      }
    )
  })
