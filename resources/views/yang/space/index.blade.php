@extends('layouts.yang.space')

@section('content')

    {{--同心球的缩放，动态操纵的样式表--}}
    <style id="style_zoom"></style>

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

        </div>
        {{--.galaxy ends--}}

    </div>
    {{--.stage ends--}}

    {{--关于分类的操作--}}
    <div id="ctg_box" class="operation">

        <form enctype="multipart/form-data" id="ctg_form">
            <textarea title="" name="title"></textarea>
            <div class="submit">ok</div>
            <input type="hidden" name="ctg_id" value="0">
            <input type="hidden" name="pid" value="0">
            <input type="hidden" name="tier" value="0">
            <input type="hidden" name="act">
        </form>
        {{--聚焦选中 .star--}}
        <div class="btn ctg_btn" title="{{ trans('buttons.title.focus') }}" data-func="focus" >{{ trans('buttons.focus') }}</div>
        {{--隐藏操作界面--}}
        <div class="btn ctg_btn" title="{{ trans('buttons.title.hideOper') }}" data-func="hide" >{{ trans('buttons.hideOper') }}</div>
        {{--显示分类的子类内容--}}
        <div class="btn ctg_btn" title="{{ trans('buttons.title.showDesc') }}" data-func="descendant" >{{ trans('buttons.showDesc') }}</div>
        {{--添加一个子级分类--}}
        <div class="btn ctg_btn" title="{{ trans('buttons.title.addDesc') }}" data-action="{{ route('createCtg') }}" data-act="desc">{{ trans('buttons.addDesc') }}</div>
        {{--添加一个同级分类--}}
        <div class="btn ctg_btn" title="{{ trans('buttons.title.addSibl') }}" data-action="{{ route('createCtg') }}" data-act="sibl">{{ trans('buttons.addSibl') }}</div>
        {{--编辑分类标题--}}
        <div class="btn ctg_btn" title="{{ trans('buttons.title.editCtg') }}" data-message="edit-self" data-action="{{ route('updateCtg') }}">{{ trans('buttons.editCtg') }}</div>
        {{--添加一个子内容--}}
        <div class="btn ctg_btn" title="{{ trans('buttons.title.addItem') }}"  data-action="{{ route('createItem') }}">{{ trans('buttons.addItem') }}</div>

    </div>

    {{--关于内容的操作--}}
    <div id="item_box" class="operation">

        <form enctype="multipart/form-data" id="item_form">
            <textarea name="title"></textarea>
            <div class="submit">ok</div>
            <input type="hidden" name="item_id" value="0">
        </form>
        {{--聚焦选中 .star--}}
        <div class="btn item_btn" title="{{ trans('buttons.title.focus') }}" data-func="focus" >{{ trans('buttons.focus') }}</div>
        {{--隐藏操作面板--}}
        <div class="btn item_btn" title="{{ trans('buttons.title.hideOper') }}" data-func="hide" >{{ trans('buttons.hideOper') }}</div>
        {{--编辑内容标题--}}
        <div class="btn item_btn" title="{{ trans('buttons.title.editItem') }}" data-action="{{ route('updateItem') }}">{{ trans('buttons.editItem') }}</div>
        {{--显示详细内容--}}
        <div class="btn item_btn" title="{{ trans('buttons.title.showItem') }}" data-func="detail" >{{ trans('buttons.showItem') }}</div>

    </div>
    {{--左上角返回主页按钮--}}
    <div id="top_left">
        <a class="home" href="{{ route('home') }}" title="{{ trans('general.title.home') }}" >{{ trans('general.home') }}</a>

        <a class="space" href="{{ route('space') }}" title="{{ trans('general.title.space') }}" >{{ trans('general.space') }}</a>
    </div>
    {{--右上角用户信息--}}
    <div id="top_right">
        <img src="{{ asset('portrait/' . $user->profile->portrait) }}" title="{{ $user->name }}">
    </div>

    {{--内容详情的弹出层开始--}}
    <input type="hidden" id="item_detail_url" value="{{ route('itemDetail') }}">
    <input type="hidden" id="edit_item_detail_url" value="{{ route('editItemDetail') }}">

    <div id="pop_item">
        <div id="editor"></div>
        <div class="pop knob close" id="pop_close"></div>
        <div class="pop knob save" id="pop_save"></div>
    </div>
    {{--内容详情的弹出层结束--}}

    @if(App::environment('development'))
        <script data-main="/resources/assets/js/yang/yang-space.js" src="/resources/assets/js/require.js"></script>
        <script type="text/javascript">
            require.config({
                               urlArgs: "v=" + (new Date()).getTime()
                           });
        </script>
    @else
        <script src="{{ URL::asset('/js/yang-space.js') }}"></script>
    @endif

@endsection