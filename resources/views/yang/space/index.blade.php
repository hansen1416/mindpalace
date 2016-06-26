@extends('layouts.yang.space')

@section('content')

    <style id="style_zoom"></style>
    <style id="style_section"></style>
    <div id="stage">

        <div id="galaxy">

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

        <!-- .star.tier-0{$$$}*200 -->

        </div>

    </div>
    {{--关于分类的操作--}}
    <div id="ctg_box" class="operation">

        <form enctype="multipart/form-data" id="ctg_form">
            <textarea name="title"></textarea>
            <div class="submit">ok</div>
            <input type="hidden" name="ctg_id" value="0">
            <input type="hidden" name="pid" value="0">
            <input type="hidden" name="tier" value="0">
            <input type="hidden" name="act">
        </form>
        {{--聚焦选中 .star--}}
        <div class="btn ctg_btn"  title="{{ trans('buttons.title.focus') }}" >{{ trans('buttons.focus') }}</div>
        {{--隐藏操作界面--}}
        <div class="btn ctg_btn"  title="{{ trans('buttons.title.hideOper') }}" >{{ trans('buttons.hideOper') }}</div>
        {{--添加一个子级分类--}}
        <div class="btn ctg_btn"  title="{{ trans('buttons.title.addDesc') }}"  data-action="{{ route('createCtg') }}" data-act="desc">{{ trans('buttons.addDesc') }}</div>
        {{--添加一个同级分类--}}
        <div class="btn ctg_btn"  title="{{ trans('buttons.title.addSibl') }}"  data-action="{{ route('createCtg') }}" data-act="sibl">{{ trans('buttons.addSibl') }}</div>
        {{--编辑分类标题--}}
        <div class="btn ctg_btn"  title="{{ trans('buttons.title.editCtgName') }}" data-action="{{ route('updateCtg') }}">{{ trans('buttons.editCtgName') }}</div>
        {{--添加一个子内容--}}
        <div class="btn ctg_btn"  title="{{ trans('buttons.title.addItem') }}"  data-action="{{ route('createItem') }}">{{ trans('buttons.addItem') }}</div>

    </div>

    {{--关于内容的操作--}}
    <div id="item_box" class="operation">

        <form enctype="multipart/form-data" id="item_form">
            <textarea name="title"></textarea>
            <div class="submit">ok</div>
            <input type="hidden" name="item_id" value="0">
        </form>
        {{--聚焦选中 .star--}}
        <div class="btn item_btn btn-focus" title="{{ trans('general.focus') }}" ></div>
        {{--隐藏操作面板--}}
        <div class="btn item_btn btn-hide"  title="{{ trans('general.hideOper') }}" ></div>
        {{--编辑内容标题--}}
        <div class="btn item_btn"           title="{{ trans('general.editSelf') }}" data-action="{{ route('updateItem') }}"></div>
        {{--显示详细内容--}}
        <div class="btn item_btn"           title="{{ trans('general.showItem') }}" ></div>

    </div>
    {{--左上角返回主页按钮--}}
    <div id="top_left">
        <a href="{{ route('home') }}">{{ trans('general.home') }}</a>
    </div>
    {{--右上角用户信息--}}
    <div id="top_right">
        <img src="{{ asset('portrait/' . $user->profile->portrait) }}" title="{{ $user->name }}">
    </div>

    @if(App::environment('development'))
        <script data-main="/resources/assets/js/yang/yang-space.js" src="{{ URL::asset('/js/require.js') }}"></script>
        <script type="text/javascript">
            require.config({
                               urlArgs: "v=" + (new Date()).getTime()
                           });
        </script>
    @else
        <script src="{{ URL::asset('/js/yang-space.js') }}"></script>
    @endif

@endsection