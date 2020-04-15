<template>
	<view class="header">
		<view class="address">{{city}}</view>
		<view class="input">
			<input type="text" value="" />
		</view>
		<view class="find">
			<button type="primary">查询</button>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				city:'北京',
			}
		}
	}
</script>

<style>
	.header{
		background:red;
	}
</style>
