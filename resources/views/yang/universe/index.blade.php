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

    // window.addEventListener("load", callback, false);
        
    // function callback(){
    //     var R = new Rubik({
    //         stage: "stage",
    //         obj: ["galaxy"],
    //         tamano: 0.6,
    //         impulse: true,
    //         resetMotion: true,
    //         omegaGap: 0.8,          //default 0.2, possible value 0 - infinite
    //         lambda:0.008            //default 0.01, possible value 0 - infinite
    //     });

    // }
    
</script>
<!-- develop -->

<!-- product -->
<!-- <script src="{{ asset('/js/universe.js') }}"></script> -->
<!-- product -->

@endsection