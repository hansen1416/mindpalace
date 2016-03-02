@extends('yang.universe.layouts')

@section('content')
<div id="galaxy">

<div class="axis x"><span class="d">x</span></div>
<div class="axis y"><span class="d">y</span></div>
<div class="axis z"><span class="d">z</span></div>

{!!$html!!}

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