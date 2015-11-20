@extends('yang.universe.layouts')

@section('content')

@foreach ($ctgs as $value)
    <p> {{$value}} </p>
@endforeach

@endsection