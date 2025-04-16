// ==UserScript==
// @name         Blum Automation Pro
// @namespace    https://github.com/your-profile
// @version      2.1
// @description  Advanced automation script for Blum platform
// @match        https://telegram.blum.codes/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// ==/UserScript==

// 等待函数（每次间隔60秒）
function waitForElementByClass(className, index = 0, delay = 60000) {
  return new Promise((resolve) => {
    const check = () => {
      const elements = document.getElementsByClassName(className)[index];
      if (elements) {
        resolve(elements); // 找到元素时解析Promise
      } else {
        console.log(`⏳ 未找到元素 [${className}]，${delay/1000}秒后重试...`);
        setTimeout(check, delay); // 无限循环
      }
    };
    check(); // 立即执行首次检查
  });
}

function waitForElementBySelectro(selector, delay = 10000) {
  return new Promise((resolve) => {
    const check = () => {
      const elements = document.querySelector(selector);
      if (elements) {
        resolve(elements); // 找到元素时解析Promise
      } else {
        console.log(`⏳ 未找到元素 [${selector}]，${delay/1000}秒后重试...`);
        setTimeout(check, delay); // 无限循环
      }
    };
    check(); // 立即执行首次检查
  });
}

async function goonchain(){
  // 2. 点击a标签（无需等待）
    const aTag = await waitForElementBySelectro('a[href="/tasks"]');
    if (aTag) {
      aTag.click();
      console.log('✅ 已跳转至任务页面');
    } else {
      console.warn('⚠️ a标签未找到');
    }

    // 3. 强制等待5秒
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 4.点击onchain
    const label = await waitForElementByClass('tab show-dot', 2, 5000);
    label.click();

}

// 主流程控制
async function main() {
  console.log('✅ 开始领取');
  try {
    // 1. 点击start按钮（等待出现并点击）
    const startBtn = await waitForElementByClass('tasks-pill-inline is-status-not-started is-dark pages-tasks-pill pill-btn', 1);
    startBtn.click();
    console.log('✅ 已触发start按钮');

    // 2. 点击a标签（无需等待）
    const aTag = document.querySelector('a[href="/tasks"]');
    if (aTag) {
      aTag.click();
      console.log('✅ 已跳转至任务页面');
    } else {
      console.warn('⚠️ a标签未找到');
    }

    // 3. 强制等待5秒
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 4.点击onchain
    const label = await waitForElementByClass('tab show-dot', 2, 5000);
    label.click();

    // 5. 点击claim按钮（等待出现并点击）
    const claimBtn = await waitForElementByClass('tasks-pill-inline is-status-ready-for-claim is-dark pages-tasks-pill pill-btn',0,10000);
    claimBtn.click();
    console.log('✅ 已提交claim请求');

  } catch (error) {
    console.error('❌ 脚本执行失败:', error.message);
  }
}

async function runMainLoop() {
  while (true) {
    // 无限循环
    await goonchain();
    await main();               // 等待 main 完全执行
    console.log('🔄 领取成功,等待第二次开始');
    // 循环间隔（例如 60 秒）
    await new Promise(resolve => setTimeout(resolve, 5*60000));
  }
}
runMainLoop(); // 启动循环