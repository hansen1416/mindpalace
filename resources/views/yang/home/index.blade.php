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

    <div class="portrait">
        @if (Auth::guest())
            <a href="{{ url('/login') }}">Login</a>
            <a href="{{ url('/register') }}">Register</a>
        @else

            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                {{ Auth::user()->name }} <span class="caret"></span>
            </a>

            <ul class="dropdown-menu" role="menu">
                <li><a href="{{ url('/logout') }}"><i class="fa fa-btn fa-sign-out"></i>Logout</a></li>
            </ul>

        @endif
    </div>

    @if(App::environment('development'))
        <script data-main="/resources/assets/js/yang/yang-home.js" src="{{ URL::asset('/js/require.js') }}"></script>
        <script type="text/javascript">
            require.config({
                               urlArgs: "v=" + (new Date()).getTime()
                           });
        </script>
    @else
        <script src="{{ URL::asset('/js/home.js') }}"></script>
    @endif

@endsection
