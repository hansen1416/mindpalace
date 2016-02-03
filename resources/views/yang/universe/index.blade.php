@extends('yang.universe.layouts')

@section('content')
<div id="galaxy">

{!!$html!!}

</div>

<!-- develop -->
<script data-main="{{ asset('../resources/assets/js/app/main-universe.js') }}" src="{{ asset('/js/require.js') }}"></script>
<!-- develop -->

<!-- deploy -->
<!-- <script src="{{ asset('/js/universe.js') }}"></script> -->
<!-- deploy -->

@endsection