<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Mind Palace</title>

    <!-- develop -->
    <link rel="stylesheet/less" type="text/css" href="{{ asset('../resources/assets/less/yang.less') }}" />
    <script type="text/javascript" src="{{ asset('../node_modules/less/dist/less.js') }}"></script>
    <!-- develop -->

    <!-- deploy -->
	<!-- <link href="{{ asset('/css/yang.min.css') }}" rel="stylesheet"> -->
    <!-- <script src="{{ asset('/js/require.js') }}"></script> -->
    <!-- deploy -->

</head>
<body>
	<div id="stage">
	@yield('content')
	</div>
</body>
</html>