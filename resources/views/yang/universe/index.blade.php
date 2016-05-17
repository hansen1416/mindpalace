@extends('yang.universe.layouts')

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

<div id="operation">

    <form action="" method="post" id="addDescForm">
        <textarea name="title"></textarea>
        <input type="hidden" name="ctg_id">
        <input type="hidden" name="pid" value="0">
        <input type="hidden" name="tier" value="0">
        <input type="submit" value="ok">
    </form>

    <div class="btn one" id="addDesc" title="{{ trans('general.addDesc') }}" data-action="{{ route('universeCreate') }}"></div>

    <div class="btn two" id="editSelf" title="{{ trans('general.editSelf') }}" data-action="{{ route('universeUpdate') }}"></div>

</div>

<div id="core">

</div>

<!-- develop -->
<script data-main="{{ asset('../resources/assets/js/app/main-universe.js') }}" src="{{ asset('/js/require.js') }}"></script>
<script type="text/javascript">
	require.config({
        urlArgs: "v=" + (new Date()).getTime()
    });
</script>
<!-- develop -->

<!-- product -->
<!-- <script src="{{ asset('/js/universe.js') }}"></script> -->
<!-- product -->

@endsection