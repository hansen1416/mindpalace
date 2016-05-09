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

    <div class="bearing one">
        <div class="btn" id="addDesc" title="{{ trans('general.addDesc') }}"></div>
        <form action="{{ route('universeCreate') }}" method="post" id="addDescForm">
            <input type="text" title="title" name="title">
            <input type="hidden" name="pid">
            <input type="hidden" name="tier">
            <input type="submit" value="ok">
        </form>
    </div>

    <div class="bearing two">
        <div class="btn" id="editSelf" title="{{ trans('general.editSelf') }}"></div>
        <form action="{{ route('universeUpdate') }}" method="post" id="editSelfForm">
            <input type="text" name="title">
            <input type="hidden" name="ctg_id">
            <input type="submit" value="ok">
        </form>
    </div>

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