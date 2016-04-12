@extends('yang.universe.layouts')

@section('content')
<div id="galaxy">

<div class="axis x"><span class="d x">x</span></div>
<div class="axis y"><span class="d y">y</span></div>
<div class="axis z"><span class="d z">z</span></div>

<!-- <div class="plane x">123</div> -->
<!-- <div class="plane y"></div> -->
<!-- <div class="plane z"></div> -->

<!-- {!!$html!!} -->

<div class="star tier-0">1</div>
<div class="star tier-0">2</div>
<div class="star tier-0">3</div>
<div class="star tier-0">4</div>
<div class="star tier-0">5</div>
<div class="star tier-0">6</div>
<div class="star tier-0">7</div>
<div class="star tier-0">8</div>
<div class="star tier-0">9</div>
<div class="star tier-0">10</div>
<div class="star tier-0">11</div>
<div class="star tier-0">12</div>
<div class="star tier-0">13</div>
<div class="star tier-0">14</div>
<div class="star tier-0">15</div>
<div class="star tier-0">16</div>
<div class="star tier-0">17</div>
<div class="star tier-0">18</div>
<div class="star tier-0">19</div>
<div class="star tier-0">20</div>
<div class="star tier-0">21</div>
<div class="star tier-0">22</div>
<div class="star tier-0">23</div>
<div class="star tier-0">24</div>
<div class="star tier-0">25</div>
<div class="star tier-0">26</div>
<div class="star tier-0">27</div>
<div class="star tier-0">28</div>
<div class="star tier-0">29</div>
<div class="star tier-0">30</div>
<div class="star tier-0">31</div>
<div class="star tier-0">32</div>
<div class="star tier-0">33</div>
<div class="star tier-0">34</div>
<div class="star tier-0">35</div>
<div class="star tier-0">36</div>
<div class="star tier-0">37</div>
<div class="star tier-0">38</div>
<div class="star tier-0">39</div>
<div class="star tier-0">40</div>
<div class="star tier-0">41</div>
<div class="star tier-0">42</div>
<div class="star tier-0">43</div>
<div class="star tier-0">44</div>
<div class="star tier-0">45</div>
<div class="star tier-0">46</div>
<div class="star tier-0">47</div>
<div class="star tier-0">48</div>
<div class="star tier-0">49</div>
<div class="star tier-0">50</div>

</div>

<!-- develop -->
<script data-main="{{ asset('../resources/assets/js/app/main-universe.js') }}" src="{{ asset('/js/require.js') }}"></script>
<script type="text/javascript">
	require.config({
        urlArgs: "v=" + (new Date()).getTime()
    });
</script>
<!-- develop -->

<!-- product -->
<!-- <script src="{{ asset('/js/universe.js') }}"></script> -->
<!-- product -->

@endsection