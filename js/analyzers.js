var analyzers={
	ac:false,
	body:false,
	init:function(){
		var AC=window.webkitAudioContext||window.AudioContext;
		if(!AC)throw "audiocontext not supported";
		analyzers.ac=new AC();
		analyzers.body=document.getElementsByTagName('body')[0];
	},
	PeakMeter:function(src){
		var an=analyzers.ac.createAnalyser(),
			cv=document.createElement('canvas');
		
		cv.width=300;
		cv.height=100;
		analyzers.body.appendChild(cv);
		
		var dat=new Uint8Array(an.frequencyBinCount),
			ct=cv.getContext('2d'),
			w=Math.ceil(an.frequencyBinCount/cv.width),
			rw=Math.ceil(cv.width/an.frequencyBinCount),
			h=cv.height/0xff, src;
		
		src.connect(an);
		this.connect=function(d){
			an.connect(d);
		};
		
		this.render=function(){
			an.getByteFrequencyData(dat);
			ct.clearRect(0,0,cv.width,cv.height);
			
			for(var i=0, t=0; i<cv.width; i++, t=i*w){
				for(var v=0;t<(i+1)*w;t++)v+=dat[t];
				v=v/w*h;
				ct.fillRect(i*rw,cv.height-v,rw,v);
			}
		};
	},
	Spectrograph:function(src){
		var an=analyzers.ac.createAnalyser(),
			cv=document.createElement('canvas');
		
		cv.width=300;
		cv.height=100;
		analyzers.body.appendChild(cv);
		
		var dat=new Uint8Array(an.frequencyBinCount),
			ct=cv.getContext('2d'),
			w=Math.ceil(an.frequencyBinCount/cv.width),
			rw=Math.ceil(cv.width/an.frequencyBinCount),
			h=cv.height/0xff, src;
		
		src.connect(an);
		this.connect=function(d){
			an.connect(d);
		};
		
		this.render=function(){
			an.getByteFrequencyData(dat);
			var data = ct.getImageData(0, 0, cv.width, cv.height);
			ct.putImageData(data, 0, -1);
			for(var i=0, t=0; i<cv.width; i++, t=i*w){
				for(var v=0;t<(i+1)*w;t++)v+=dat[t];
				v=v/w;
				ct.fillStyle="rgb(0,"+v+",0)";
				ct.fillRect(i*rw,cv.height-1,rw,1);
			}
		};
	}
};
