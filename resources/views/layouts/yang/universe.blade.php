<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="shortcut icon" href="{{ asset('favicon.ico') }}" >
	<title>{{ trans('general.pageTitle') }}</title>

    <!-- develop -->
    <link rel="stylesheet/less" type="text/css" href="{{ asset('../resources/assets/less/yang.less') }}" >
    <script type="text/javascript" src="{{ asset('../node_modules/less/dist/less.js') }}"></script>
    <!-- develop -->

    <!-- product -->
	<!-- <link href="{{ asset('/css/yang.min.css') }}" rel="stylesheet"> -->
    <!-- <script src="{{ asset('/js/require.js') }}"></script> -->
    <!-- product -->

</head>
<body>

	@yield('content')

</body>
</html>