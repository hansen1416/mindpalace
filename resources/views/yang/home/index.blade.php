@extends('layouts.yang.home')

@section('content')

    {{--跳转到space--}}
    <div class="panel">
        <a href="{{ route('space') }}">{{ trans('general.space') }}</a>
    </div>
    {{--根据登陆状态显示登陆或登出--}}
    @if ($user)
        <div class="panel" id="logout">
            {{ trans('general.logout') }}
        </div>
    @else
        <div class="panel" id="login">
            {{ trans('general.login') }}
        </div>
    @endif

    {{--根据登陆状态显示用户头像或者是登陆输入框--}}
    <div class="portrait" id="portrait">

        @if ($user)
            <img src="{{ asset('portrait/' . $user->profile->portrait) }}" title="{{ $user->name }}">
        @else
        <form enctype="multipart/form-data" class="portrait-form" id="portrait_form">

            <input type="email" name="email" value="{{ old('email') }}">
            @if ($errors->has('email'))
            <span class="help-block">
                <strong>{{ $errors->first('email') }}</strong>
            </span>
            @endif
            <input type="password" name="password">
            @if ($errors->has('password'))
            <span class="help-block">
                <strong>{{ $errors->first('password') }}</strong>
            </span>
            @endif
            <div class="remember-box">
                <label for="remember">
                    <input id="remember" type="checkbox" name="remember">
                    <span>{{ trans('general.remember') }}</span>
                </label>
            </div>

        </form>
        @endif

    </div><!-- #portrait.portrait ends -->

    <input type="hidden" id="login_url" value="{{ route('login') }}">
    <input type="hidden" id="logout_url" value="{{ route('logout') }}">

    @if(App::environment('development'))
        <script data-main="/resources/assets/js/yang/yang-home.js" src="/resources/assets/js/require.js"></script>
        <script type="text/javascript">
            require.config({
                               urlArgs: "v=" + (new Date()).getTime()
                           });
        </script>
    @else
        <script src="{{ URL::asset('/js/yang-home.js') }}"></script>
    @endif

@endsection
