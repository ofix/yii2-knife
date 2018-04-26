<?php
\frontend\assets\RuleAsset::register($this);
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
<body>
<div id="left-panel"></div>
<div id="right-panel">
    <div id="rule-toolbar">
        <div class="rule-btn rule-active-btn" data-rule="required">required（必填）</div>
        <div class="rule-btn" data-rule="string">string（字符串）</div>
        <div class="rule-btn" data-rule="trim">trim（译为修剪/裁边）</div>
        <div class="rule-btn" data-rule="unique">unique（唯一性）</div>
        <div class="rule-btn" data-rule="url">url（网址）</div>
        <div class="rule-btn" data-rule="boolean">boolean（布尔型）</div>
        <div class="rule-btn" data-rule="captcha">captcha（验证码）</div>
        <div class="rule-btn" data-rule="compare">compare（比对）</div>
        <div class="rule-btn" data-rule="date">date（日期）</div>
        <div class="rule-btn" data-rule="default">default（默认值）</div>
        <div class="rule-btn" data-rule="double">double（双精度浮点型）</div>
        <div class="rule-btn" data-rule="each">each（循环验证）</div>
        <div class="rule-btn" data-rule="email">email（电子邮件）</div>
        <div class="rule-btn" data-rule="exist">exist（存在性）</div>
        <div class="rule-btn" data-rule="file">file（文件）</div>
        <div class="rule-btn" data-rule="filter">filter（过滤器）</div>
        <div class="rule-btn" data-rule="image">image（图片）</div>
        <div class="rule-btn" data-rule="ip">ip（IP地址）</div>
        <div class="rule-btn" data-rule="in">in（范围）</div>
        <div class="rule-btn" data-rule="integer">integer（整数）</div>
        <div class="rule-btn" data-rule="match">match（正则表达式）</div>
        <div class="rule-btn" data-rule="number">number（数字）</div>
        <div class="rule-btn" data-rule="safe">safe（安全）</div>
    </div>
    <div id="columns"></div>
    <div id="rule-input"></div>
    <textarea title="PHP Code" id="rule-code"></textarea>
    <div id="btn-gen">generate</div>
</div>
</body>
</html>