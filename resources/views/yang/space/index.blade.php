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

    <div id="ctg_box" class="operation">

        <form action="" method="post" id="addDescForm">
            <textarea name="title"></textarea>
            <input type="hidden" name="ctg_id" value="0">
            <input type="hidden" name="item_id" value="0">
            <input type="hidden" name="pid" value="0">
            <input type="hidden" name="tier" value="0">
            <input type="hidden" name="act">
            <input type="submit" value="ok">
        </form>

        <div class="btn ctg_btn" id="focus"     title="{{ trans('general.focus') }}" ></div>
        <div class="btn ctg_btn" id="addDesc"   title="{{ trans('general.addDesc') }}"  data-ctg_action="{{ route('createCtg') }}"></div>
        <div class="btn ctg_btn" id="addSibl"   title="{{ trans('general.addSibl') }}"  data-ctg_action="{{ route('createCtg') }}"></div>
        <div class="btn ctg_btn" id="editSelf"  title="{{ trans('general.editSelf') }}" data-ctg_action="{{ route('updateCtg') }}" data-item_action="{{ route('updateItem') }}"></div>
        <div class="btn ctg_btn" id="hideOper"  title="{{ trans('general.hideOper') }}" ></div>
        <div class="btn ctg_btn" id="addItem"   title="{{ trans('general.addItem') }}"  data-ctg_action="{{ route('createItem') }}" data-item_action="{{ route('createItem') }}"></div>
        <div class="btn ctg_btn" id="showItem"  title="{{ trans('general.showItem') }}" ></div>

    </div>

    <div id="item_box" class="operation">

        <form action="" method="post" id="addDescForm">
            <textarea name="title"></textarea>
            <input type="hidden" name="ctg_id" value="0">
            <input type="hidden" name="item_id" value="0">
            <input type="hidden" name="pid" value="0">
            <input type="hidden" name="tier" value="0">
            <input type="hidden" name="act">
            <input type="submit" value="ok">
        </form>

        <div class="btn item_btn" id="focus"     title="{{ trans('general.focus') }}" ></div>
        <div class="btn item_btn" id="addDesc"   title="{{ trans('general.addDesc') }}"  data-ctg_action="{{ route('createCtg') }}"></div>
        <div class="btn item_btn" id="addSibl"   title="{{ trans('general.addSibl') }}"  data-ctg_action="{{ route('createCtg') }}"></div>
        <div class="btn item_btn" id="editSelf"  title="{{ trans('general.editSelf') }}" data-ctg_action="{{ route('updateCtg') }}" data-item_action="{{ route('updateItem') }}"></div>
        <div class="btn item_btn" id="hideOper"  title="{{ trans('general.hideOper') }}" ></div>
        <div class="btn item_btn" id="addItem"   title="{{ trans('general.addItem') }}"  data-ctg_action="{{ route('createItem') }}" data-item_action="{{ route('createItem') }}"></div>
        <div class="btn item_btn" id="showItem"  title="{{ trans('general.showItem') }}" ></div>

    </div>

    <div id="top_left">
        <a href="{{ route('home') }}">{{ trans('general.home') }}</a>
    </div>

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