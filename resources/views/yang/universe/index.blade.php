@extends('yang.universe.layouts')

@section('content')

@foreach ($ctgs as $value)
    <p> {{$value->title}} </p>
@endforeach

@endsection