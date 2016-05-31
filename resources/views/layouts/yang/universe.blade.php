<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="shortcut icon" href="{{ asset('favicon.ico') }}" >
	<title>{{ trans('general.pageTitle') }}</title>

	<link href="{{ URL::asset('/css/yang.min.css') }}" rel="stylesheet">
    <script src="{{ URL::asset('/js/require.js') }}"></script>

</head>
<body>

	@yield('content')

</body>
</html>