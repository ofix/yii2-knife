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
        <div class="rule-btn rule-active-btn" data-rule="Select">Select</div>
        <div class="rule-btn" data-rule="From">From</div>
        <div class="rule-btn" data-rule="Join LeftJoin">Left Join</div>
        <div class="rule-btn" data-rule="Join InnerJoin">Inner Join</div>
        <div class="rule-btn" data-rule="Join RightJoin">Right Join</div>
        <div class="rule-btn" data-rule="Where">Where</div>
        <div class="rule-btn" data-rule="OrderBy">Order By</div>
        <div id="btn-change-name">切换</div>
    </div>
    <div class="tab-ctrl">
        <div class="tab-ctrl-head">
            <div class="active" data-rule="Select">显示字段</div>
            <div data-rule="Where">查询字段</div>
            <div data-rule="OrderBy">排序字段</div>
        </div>
        <div class="tab-ctrl-body">
            <div class="active"></div>
            <div></div>
            <div></div>
        </div>

    </div>
    <div id="columns"></div>
<!--    <div id="rule-input"></div>-->
    <textarea title="PHP Code" id="rule-code"></textarea>
</div>
</body>
</html>