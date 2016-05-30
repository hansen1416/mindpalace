@extends('layouts.yang.home')

    @section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-10 col-md-offset-1">
                <div class="panel panel-default">
                    <div class="panel-heading"></div>

                    <div class="panel-body">
                        <a href="{{ route('universe') }}">universe</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    @if(App::environment('local'))
        <script data-main="{{ URL::asset('../resources/assets/js/app/main-universe.js') }}" src="{{ URL::asset('/js/require.js') }}"></script>
        <script type="text/javascript">
            require.config({
                               urlArgs: "v=" + (new Date()).getTime()
                           });
        </script>
    @else
        <script src="{{ URL::asset('/js/universe.js') }}"></script>
    @endif

@endsection
