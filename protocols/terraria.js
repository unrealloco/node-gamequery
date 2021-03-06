const request = require('request');

module.exports = require('./core').extend({
	run: function(state) {
		const self = this;
		request({
			uri: 'http://'+this.options.address+':'+this.options.port_query+'/v2/server/status',
			timeout: 3000,
			qs: {
				players: 'true',
				token: this.options.token
			}
		}, (e,r,body) => {
			if(e) {return self.fatal('HTTP error');}
			let json;
			try {
				json = JSON.parse(body);
			} catch(e) {
				return self.fatal('Invalid JSON');
			}
			
			if(json.status !== 200) {return self.fatal('Invalid status');}

			json.players.forEach((one) => {
				state.players.push({name:one.nickname,team:one.team});
			});
			
			state.name = json.name;
			state.raw.port = json.port;
			state.raw.numplayers = json.playercount;

			self.finish(state);
		});
	}
});
