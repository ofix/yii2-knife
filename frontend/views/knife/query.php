<?php
\frontend\assets\QueryAsset::register($this);
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
<body>
<div class="search">
    <input placeholder="please enter keyword" type="text"/>
</div>
<div id="left-panel"></div>
<div id="right-panel">
    <div id="rule-toolbar">
        <div class="rule-btn rule-active-btn" data-rule="required">required（必填）</div>
        <div class="rule-btn" data-rule="string">string（字符串）</div>
    </div>
    <div id="columns"></div>
<!--    <div id="rule-input"></div>-->
    <textarea title="PHP Code" id="rule-code"></textarea>
</div>
</body>
</html>