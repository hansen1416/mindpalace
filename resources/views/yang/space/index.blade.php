@extends('layouts.yang.space')

@section('content')

    {{--同心球的缩放，动态操纵的样式表--}}
    <style id="style_zoom"></style>

    <div id="stage">

        <div class="rotate_animation" id="galaxy">

            {{--坐标系开始--}}
            {{--<style>--}}
            {{--.axis {position: absolute; width: 300px; height: 1px; top: 50%; left: 50%; margin: 0 0 0 -150px; background-color: #fff;}--}}
            {{--.axis.y {transform: rotateZ(90deg);}--}}
            {{--.axis.z {transform: rotateY(-90deg);}--}}
            {{--.axis .d {float: right; width: 0; height: 0; margin-top: -10px; color: #ff0000; border: 10px solid #ff0000; border-top-color: transparent; border-bottom-color: transparent; border-right-width: 0;}--}}
            {{--.axis .d.y{color: #00ff00; border: 10px solid #00ff00; border-top-color: transparent; border-bottom-color: transparent; border-right-width: 0;}--}}
            {{--.axis .d.z{color: #0000ff; border: 10px solid #0000ff; border-top-color: transparent; border-bottom-color: transparent; border-right-width: 0;}--}}
            {{--</style>--}}
            {{--坐标系结束--}}
            {{--<div class="axis x"><span class="d x">x</span></div>--}}
            {{--<div class="axis y"><span class="d y">y</span></div>--}}
            {{--<div class="axis z"><span class="d z">z</span></div>--}}

            {!!$html!!}

        </div>
        {{--.galaxy ends--}}

    </div>
    {{--.stage ends--}}

    @if ($html == '')
        <div class="btn" id="new_ctg" title="{{ trans('buttons.title.add_desc') }}" data-func="add_desc"
             data-action="{{ route('createCtg') }}" data-form="ctg_form" data-act="pid" data-pid="{{$pid}}">
            {{ trans('buttons.add_desc') }}
        </div>
    @endif

    {{--关于分类的操作--}}
    <div id="ctg_box" class="operation">

        {{--聚焦选中 .star--}}
        <div class="btn ctg_btn" id="focus" title="{{ trans('buttons.title.focus') }}" data-func="focus">
            {{ trans('buttons.focus') }}
        </div>
        {{--隐藏操作界面--}}
        <div class="btn ctg_btn" title="{{ trans('buttons.title.hide_plate') }}" data-func="hide">
            {{ trans('buttons.hide_plate') }}
        </div>
        {{--显示分类的子类内容--}}
        <div class="btn ctg_btn" title="{{ trans('buttons.title.show_desc') }}" data-func="descendant">
            {{ trans('buttons.show_desc') }}
        </div>
        {{--添加一个子级分类--}}
        <div class="btn ctg_btn" title="{{ trans('buttons.title.add_desc') }}" data-func="add_desc"
             data-form="ctg_form" data-act="ctg_id">
            {{ trans('buttons.add_desc') }}
        </div>
        {{--添加一个同级分类--}}
        <div class="btn ctg_btn" title="{{ trans('buttons.title.add_peer') }}" data-func="add_peer"
             data-form="ctg_form" data-act="pid">
            {{ trans('buttons.add_peer') }}
        </div>
        {{--编辑分类标题--}}
        <div class="btn ctg_btn" title="{{ trans('buttons.title.edit_ctg') }}" data-func="edit_ctg"
             data-form="ctg_form">
            {{ trans('buttons.edit_ctg') }}
        </div>
        {{--改变父级分类--}}
        <div class="btn ctg_btn" title="{{ trans('buttons.title.edit_pid') }}" data-func="edit_pid">
            {{ trans('buttons.edit_pid') }}
        </div>
        {{--添加一个子内容--}}
        <div class="btn ctg_btn" title="{{ trans('buttons.title.add_item') }}" data-func="add_item"
             data-form="item_form">
            {{ trans('buttons.add_item') }}
        </div>

    </div>

    {{--关于内容的操作--}}
    <div id="item_box" class="operation">

        {{--聚焦选中 .star--}}
        <div class="btn item_btn" title="{{ trans('buttons.title.focus') }}" data-func="focus">
            {{ trans('buttons.focus') }}
        </div>
        {{--隐藏操作面板--}}
        <div class="btn item_btn" title="{{ trans('buttons.title.hide_plate') }}" data-func="hide">
            {{ trans('buttons.hide_plate') }}
        </div>
        {{--编辑内容标题--}}
        <div class="btn item_btn" title="{{ trans('buttons.title.edit_item') }}" data-func="edit_item"
             data-form="item_form">
            {{ trans('buttons.edit_item') }}
        </div>

    </div>

    {{--分类表单--}}
    <form enctype="multipart/form-data" id="ctg_form">

        <label for="ctg_title">
            {{ trans('general.ctgTitle') }}
            <input type="text" id="ctg_title" name="title">
        </label>

        <label for="ctg_sort">
            {{ trans('general.ctgSort') }}
            <input type="text" id="ctg_sort" name="sort">
        </label>

        {{--<label for="ctg_tags">--}}
        {{--{{ trans('general.ctgTags') }}--}}
        {{--<input type="text" id="ctg_tags" name="tags">--}}
        {{--</label>--}}

        <div class="btn" data-func="hide">{{ trans('buttons.hide_plate') }}</div>
        <div class="submit">{{ trans('general.save') }}</div>
        <input type="hidden" name="ctg_id" value="0">
        <input type="hidden" name="pid" value="0">
        <input type="hidden" name="tier" value="0">
        <input type="hidden" name="act">
    </form>
    {{--分类表单--}}

    {{--内容表单--}}
    <form enctype="multipart/form-data" id="item_form">

        <label for="item_title">
            {{ trans('general.itemTitle') }}
            <input type="text" id="item_title" name="title">
        </label>

        <label for="item_sort">
            {{ trans('general.itemSort') }}
            <input type="text" id="item_sort" name="sort">
        </label>

        {{--<label for="item_tags">--}}
        {{--{{ trans('general.itemTags') }}--}}
        {{--<input type="text" id="item_tags" name="tags">--}}
        {{--</label>--}}

        <div id="editor"></div>

        <div class="btn" data-func="hide">{{ trans('buttons.hide_plate') }}</div>
        <div class="submit">{{ trans('general.save') }}</div>
        <input type="hidden" name="ctg_id" value="0">
        <input type="hidden" name="item_id" value="0">
    </form>
    {{--内容表单--}}

    {{--左上角返回主页按钮--}}
    <div id="top_left">
        <a class="home" href="{{ route('home') }}" title="{{ trans('general.title.home') }}">
            {{ trans('general.home') }}
        </a>

        <a class="btn space" href="{{ route('space') }}" title="{{ trans('general.title.space') }}">
            {{ trans('general.space') }}
        </a>

        <div class="btn reset" data-func="reset_trackball" title="{{ trans('buttons.title.resetTrackball') }}">
            {{ trans('buttons.resetTrackball') }}
        </div>
    </div>

    {{--右上角用户信息--}}
    <div id="top_right">
        <div class="portrait">
            <img src="{{ asset('portrait/' . $user->profile->portrait) }}" title="{{ $user->name }}">
        </div>

        <div class="btn theme" data-func="theme" data-action="{{ route('themes') }}"
             title="{{ trans('buttons.title.theme') }}">
            {{ trans('buttons.theme') }}
        </div>
    </div>

    <div id="themes"></div>

    {{--显示处理状态--}}
    <div id="progress" class="taiji">

    </div>

    <input type="hidden" id="create_ctg_url" value="{{ route('createCtg') }}">
    <input type="hidden" id="update_ctg_url" value="{{ route('updateCtg') }}">
    <input type="hidden" id="ctg_detail_url" value="{{ route('ctgDetail') }}">
    <input type="hidden" id="create_item_url" value="{{ route('createItem') }}">
    <input type="hidden" id="update_item_url" value="{{ route('updateItem') }}">
    <input type="hidden" id="item_detail_url" value="{{ route('itemDetail') }}">

    @if(App::environment('development'))
        <script data-main="/resources/assets/js/yang/yang-space.js" src="/resources/assets/js/require.js"></script>
        <script>
            require.config({
                               urlArgs: "v=" + (new Date()).getTime()
                           });
        </script>
    @else
        <script src="{{ URL::asset('/js/yang-space.js') }}"></script>
    @endif

@endsection