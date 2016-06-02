@extends('layouts.yang.home')

@section('content')

    <form action="">

    <div class="portrait">
        @if ($user)
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                {{ $user->name }} <span class="caret"></span>
            </a>

            <ul class="dropdown-menu" role="menu">
                <li><a href="{{ url('/logout') }}"><i class="fa fa-btn fa-sign-out"></i>Logout</a></li>
            </ul>
        @else
            {{ csrf_field() }}
            <input type="email" class="form-control" name="email" value="{{ old('email') }}">
            @if ($errors->has('email'))
                <span class="help-block">
                    <strong>{{ $errors->first('email') }}</strong>
                </span>
            @endif
            <input type="password" class="form-control" name="password">
            @if ($errors->has('password'))
                <span class="help-block">
                    <strong>{{ $errors->first('password') }}</strong>
                </span>
            @endif
            <input type="checkbox" name="remember">

        @endif
    </div>

    <div class="panel">
        <a href="{{ route('universe') }}">universe</a>
    </div>

    @if ($user)
        <div class="panel">
            <a href="{{ url('/logout') }}">universe</a>
        </div>
    @else
        <div class="panel">
            <a href="{{ url('/login') }}">Login</a>
        </div>
    @endif

    </form>

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
