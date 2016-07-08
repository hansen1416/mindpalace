<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf_token" content="{{ csrf_token() }}"/>

    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}" >
    <title>{{ trans('general.pageTitle') }}</title>

    @if(App::environment('development'))
        <link rel="stylesheet/less" type="text/css" href="/resources/assets/less/yang/theme/{{$theme}}.less">
        <link rel="stylesheet/less" type="text/css" href="/resources/assets/less/yang/yang-home.less">
        <script src="/resources/assets/less/less.min.js"></script>
    @else
        <link href="{{ URL::asset('/css/theme/' . $theme . '.css') }}" rel="stylesheet">
        <link href="{{ URL::asset('/css/yang-home.css') }}" rel="stylesheet">
    @endif

</head>
<body id="yang-home">

    @yield('content')

</body>
</html>
