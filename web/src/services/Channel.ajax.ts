import axios from 'axios'

export default {
	invoke(api: string, /* json */ args?: any): Promise<any> { // 从api获取数据 fetch
		var promise = new Promise((resolve, reject) => {
			axios.post('/api/' + api, args, {
				headers: { 'Content-Type': 'application/json;charset=UTF-8' }
			}).then(res => {
				if (res.data && res.data.code === 200) {
					resolve(res.data)
				} else {
					reject(res.data.msg)
				}
				console.log(res)

			}).catch(err => {
				reject(err)
			})
		})
		return promise
	},
	//需要token的请求
	tokenInvoke(api: string, /* json */ args?: any): Promise<any> { // 从api获取数据 fetch
		var promise = new Promise((resolve, reject) => {
			axios.post('/api/' + api, args, {
				headers: { 'Content-Type': 'application/json;charset=UTF-8'	,
							'token':'23123123123123123' }
			}).then(res => {
				if (res.data && res.data.code === 200) {
					resolve(res.data)
				} else {
					reject(res.data.msg)
				}
				console.log(res)

			}).catch(err => {
				reject(err)
			})
		})
		return promise
	},
	/* 将datetime格式转为接口要求的string */
	formatDate(now: Date) {
		var year = now.getFullYear();
		var month = this.formatNumber(now.getMonth() + 1);		
		var date = this.formatNumber(now.getDate());
		var hour = this.formatNumber(now.getHours());
		var minute = this.formatNumber(now.getMinutes());
		var second = this.formatNumber(now.getSeconds());

		// console.log(year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second) // tb commented
		return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
	},

	/* 对个位数的月日时分在前面加零 */
	formatNumber(t: number){
		if (t < 10){
			return '0' + t
		} else {
			return t
		}
	}

}