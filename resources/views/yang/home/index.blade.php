@extends('layouts.yang.home')

@section('content')

    <form action="{{ $user ? url('/logout') : url('/login') }}">
        {{--根据登陆状态显示用户头像或者是登陆输入框--}}
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
        {{--跳转到universe--}}
        <div class="panel">
            <a href="{{ route('universe') }}">{{ trans('general.universe') }}</a>
        </div>
        {{--根据登陆状态显示登陆或登出--}}
        @if ($user)
        <div class="panel">
            <input type="submit" value="{{ trans('general.logout') }}">
            {{--<a href="{{ url('/logout') }}"></a>--}}
        </div>
        @else
        <div class="panel">
            <input type="submit" value="{{ trans('general.login') }}">
{{--            <a href="{{ url('/login') }}">{{ trans('general.login') }}</a>--}}
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
