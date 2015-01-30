var CONVERTOR = (function () {
	var ctx,				/* CanvasRenderingContext2D */
		renderTable,		/* Array */
		WIDTH=0,			/* Int */
		HEIGHT=0,			/* Int */
		image,				/* ImageData */
		bufa,				/* ArrayBuffer */
		buf8,				/* Uint8ClampedArray */
		buf32,				/* new Uint32Array */
		clicked=0,			/* Int */
		cnt=0,				/* Int */
		interval=-1,		/* Int */
		empty,				/* Array */
		algos=[],			/* Array */
		object={};			/* Object */
	
	if (!window.performance) performance={};
	
	performance.now = performance.now || function () { };

	function getData(a) {
		var ctx2;
		(ctx2=document.createElement("canvas").getContext("2d")).canvas.width=a.width;
		ctx2.canvas.height=a.height;
		ctx2.drawImage(a,0,0);
		return ctx2.getImageData(0,0,a.width,a.height);
	}
	
	// alg 1
	algos.push({ 
		name:"Sorted brightness (fast)",
		id:"sortbw",
		run: function (imgdata1,imgdata2,renderTable) {
			function sumfunc(a,b) { return a+b; }
		
			function sortAndDoStuff(bool,d) {
				return [].map.bind([].map.bind(d.data)(function (a,b,c) { if (b%4===0) { return ((c[b+3] << 24) | (c[b+2] << 16) | (c[b+1] <<  8) | (c[b])) } return null;})
				.filter(function (a) { if (a==null) return false; return true; }).map(function (a,b) {
					var pix=new Pixel(),i=-8;
					pix.x=(WIDTH/2-d.width/2)+(b%(d.width));
					pix.y=(HEIGHT/2-d.height/2)+Math.floor(b/(d.width));
					pix.value=a;
					if (bool) renderTable.push(pix) 
					return ((",,,".split(",").map(function () { return ((a&255<<(i+=8))>>(i)) })).slice(0,3).reduce(sumfunc)/3);
				}).map(function (a) {
					return a;
				}))(function (a,b,c) {
					return [b,a]
				}).sort(function (a,b) {
					return a[1]-b[1];
				}).map(function (a,b) {
					return a[0];
				});
			}
			
			var sortArray1=sortAndDoStuff(true,imgdata1);
		
		
			var sortArray2=sortAndDoStuff(false,imgdata2);
			
			for (var i=0;i<sortArray1.length;i++) { 
				var rT=renderTable[sortArray1[i]];
				var nRT=sortArray2[i];
				rT.gx=(WIDTH/2-imgdata2.width/2)+(nRT%(imgdata2.width));
				rT.gy=(HEIGHT/2-imgdata2.height/2)+Math.floor(nRT/(imgdata2.width));
			}
		}
	});
	
	// alg 1
	algos.push({ 
		name:"Sorted brightness [Inverted] (fast)",
		id:"sortbwINVERT",
		run: function (imgdata1,imgdata2,renderTable) {
			function sumfunc(a,b) { return a+b; }
		
			function sortAndDoStuff(bool,d) {
				return [].map.bind([].map.bind(d.data)(function (a,b,c) { if (b%4===0) { return ((c[b+3] << 24) | (c[b+2] << 16) | (c[b+1] <<  8) | (c[b])) } return null;})
				.filter(function (a) { if (a==null) return false; return true; }).map(function (a,b) {
					var pix=new Pixel(),i=-8;
					pix.x=(WIDTH/2-d.width/2)+(b%(d.width));
					pix.y=(HEIGHT/2-d.height/2)+Math.floor(b/(d.width));
					pix.value=a;
					if (bool) renderTable.push(pix) 
					return ((",,,".split(",").map(function () { return ((a&255<<(i+=8))>>(i)) })).slice(0,3).reduce(sumfunc)/3);
				}).map(function (a) {
					return a;
				}))(function (a,b,c) {
					return [b,a]
				}).sort(function (a,b) {
					return a[1]-b[1];
				}).map(function (a,b) {
					return a[0];
				});
			}
			
			var sortArray1=sortAndDoStuff(true,imgdata1);
		
		
			var sortArray2=sortAndDoStuff(false,imgdata2);
			
			for (var i=0;i<sortArray1.length;i++) { 
				var rT=renderTable[sortArray1[i]];
				var nRT=sortArray2[(sortArray2.length-1)-i];
				rT.gx=(WIDTH/2-imgdata2.width/2)+(nRT%(imgdata2.width));
				rT.gy=(HEIGHT/2-imgdata2.height/2)+Math.floor(nRT/(imgdata2.width));
			}
		}
	});
	
	// alg 1
	algos.push({ 
		name:"Sorted brightness [Messed modulo] (fast)",
		id:"sortbwMODULO",
		run: function (imgdata1,imgdata2,renderTable) {
			function sumfunc(a,b) { return a+b; }
		
			function sortAndDoStuff(bool,d) {
				return [].map.bind([].map.bind(d.data)(function (a,b,c) { if (b%4===0) { return ((c[b+3] << 24) | (c[b+2] << 16) | (c[b+1] <<  8) | (c[b])) } return null;})
				.filter(function (a) { if (a==null) return false; return true; }).map(function (a,b) {
					var pix=new Pixel(),i=-8;
					pix.x=(WIDTH/2-d.width/2)+(b%(d.width));
					pix.y=(HEIGHT/2-d.height/2)+Math.floor(b/(d.width));
					pix.value=a;
					if (bool) renderTable.push(pix) 
					return ((",,,".split(",").map(function () { return ((a&255<<(i+=8))>>(i)) })).slice(0,3).reduce(sumfunc)/3);
				}).map(function (a) {
					return a;
				}))(function (a,b,c) {
					return [b,a]
				}).sort(function (a,b) {
					return a[1]-b[1];
				}).map(function (a,b) {
					return a[0];
				});
			}
			
			var sortArray1=sortAndDoStuff(true,imgdata1);
		
		
			var sortArray2=sortAndDoStuff(false,imgdata2);
			
			for (var i=0;i<sortArray1.length;i++) { 
				var rT=renderTable[sortArray1[i]];
				var nRT=sortArray2[(Math.floor(sortArray2.length/2)+i)%sortArray2.length];
				rT.gx=(WIDTH/2-imgdata2.width/2)+(nRT%(imgdata2.width));
				rT.gy=(HEIGHT/2-imgdata2.height/2)+Math.floor(nRT/(imgdata2.width));
			}
		}
	});
	
	algos.push({ 
		name:"HSL color format (buggy)",
		id:"hslcolor",
		run: function (imgdata1,imgdata2,renderTable) {
			function sumfunc(a,b) { return a+b; }
			
			function hue2rgb(p, q, t){
	            if(t < 0) t += 1;
	            if(t > 1) t -= 1;
	            if(t < 1/6) return p + (q - p) * 6 * t;
	            if(t < 1/2) return q;
	            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	            return p;
	        }
			function findNearIndex(arr,ind) {
				var result=undefined,thres=0;
				if (arr[ind]!=undefined) { result=ind }else{
					while (result==undefined) {
						if (arr[ind+thres]!=undefined) {
							result=ind+thres;
							break;
						}else if (arr[ind-thres]!=undefined) {
							result=ind-thres;
							break;
						}else{
							thres+=1;	
							//thres=Math.round(thres*div)/div; // Stupid floating error..
						}
					}
				}
				return result;
			}
			function findFirst(arr) {
				var res=-1;
				arr.forEach(function (a,b) {
					if ((a!=undefined)&&(res==-1)) res=b;
				});
				return res;
			}
			function hslToRgb(h, s, l){
			    var r, g, b;
			
			    if(s == 0){
			        r = g = b = l; // achromatic
			    }else{
			        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			        var p = 2 * l - q;
			        r = hue2rgb(p, q, h + 1/3);
			        g = hue2rgb(p, q, h);
			        b = hue2rgb(p, q, h - 1/3);
			    }
			
			    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
			}
			
			function rgbToHsl(r, g, b){
			    r /= 255, g /= 255, b /= 255;
			    var max = Math.max(r, g, b), min = Math.min(r, g, b);
			    var h, s, l = (max + min) / 2;
			
			    if(max == min){
			        h = s = 0; // achromatic
			    }else{
			        var d = max - min;
			        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			        switch(max){
			            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			            case g: h = (b - r) / d + 2; break;
			            case b: h = (r - g) / d + 4; break;
			        }
			        h /= 6;
			    }
			
			    return [h, s, l];
			}
			var hsl0=[];
			var hsl1=[];
			
			for (var i=0,arr=imgdata1.data,len=arr.length;i<len;i+=4) {
				var h=rgbToHsl(arr[i+0],arr[i+1],arr[i+2]),s=Math.round(h[1]*255),l=Math.round(h[2]*255);
				//console.log(h);
				h=Math.round(h[0]*255);
				
				if (hsl0[h]==undefined) hsl0[h]=[];
				if (hsl0[h][s]==undefined) hsl0[h][s]=[];
				if (hsl0[h][s][l]==undefined) hsl0[h][s][l]=[];
				
				hsl0[h][s][l].push({
						x:(i/4)%imgdata1.width,
						y:Math.floor((i/4)/imgdata1.width)
				});;
			}
			
			for (var i=0,arr=imgdata2.data,len=arr.length;i<len;i+=4) {
				var h=rgbToHsl(arr[i+0],arr[i+1],arr[i+2]),s=Math.round(h[1]*255),l=Math.round(h[2]*255);
				
				h=Math.round(h[0]*255);
				
				if (hsl1[h]==undefined) hsl1[h]=[];
				if (hsl1[h][s]==undefined) hsl1[h][s]=[];
				if (hsl1[h][s][l]==undefined) hsl1[h][s][l]=[];
				
				hsl1[h][s][l].push({
						x:(i/4)%imgdata2.width,
						y:Math.floor((i/4)/imgdata2.width)
				});
			}
			var counter=0;
			for (var i=0,len1=255;i<len1;i++) { 
				if (hsl0[i]!=undefined) {
					for (var j=0,len2=255;j<len2;j++) { 
						if (hsl0[i][j]!=undefined) {
							for (var k=0,len3=255;k<len3;k++) { 
								if (hsl0[i][j][k]!=undefined) { 
									for (var l=0,len4=255;l<len4;l++) {
										counter++;
										var currentp=hsl0[i][j][k][l];
										var newp;
										var i2 = findNearIndex(hsl1,i);
										var j2 = findNearIndex(hsl1[i2],j);
										var k2 = findNearIndex(hsl1[i2][j2],k);
										newp=hsl1[i2][j2][k2][findFirst(hsl1[i2][j2][k2])];
										//return console.log(findFirst(hsl1[i2][j2][k2]));
										var pix=new Pixel();
										var rgb=hslToRgb(i/255,j/255,k/255);
										pix.value = ((255 << 24) | (rgb[2] << 16) | (rgb[1] <<  8) | (rgb[0]));
										pix.x=currentp.x;
										pix.y=currentp.y;
										pix.gx=newp.x;
										pix.gy=newp.y;
										
										try { 
										//	hsl0[i2][j2][k2]=undefined;
											newp=undefined;
											var allundef=true;
											for (var ic in hsl1[i2][j2][k2]) if (ic!=undefined) allundef=false;
											if (allundef) {
												delete hsl1[i2][j2][k2];
												break;
											}
										}
										catch (e) {
											console.log(i2,j2,k2,newp);
											expose=hsl0;
											throw e;
											return;
										}
										renderTable.push(pix);
									}
								}
							}
						}
					}
				}
			}
			expose=renderTable;
			console.log("Counter",counter);
		}
	});
	
	
	function getAlg(f) {
		for (var i=0;i<algos.length;i++) {
			f(algos[i].name,algos[i].id);
		}	
	}
	function CONV(algoid,canvas,image1,image2) {
		
		ctx=canvas.getContext("2d");
		
		imgdata1=getData(image1);
		imgdata2=getData(image2);
		
		clicked=0;
		WIDTH=Math.max(image1.width,image2.width);
		HEIGHT=Math.max(image1.height,image2.height);
		canvas.width=(WIDTH);
		canvas.height=(HEIGHT);
		image = ctx.createImageData((WIDTH), (HEIGHT));
		bufa = new ArrayBuffer(image.data.length);
		buf8 = new Uint8ClampedArray(bufa);
		buf32 = new Uint32Array(bufa);
		
		
		renderTable=[];
		var f=undefined;
		for (var i = 0;i<algos.length;i++) {
			if (algos[i].id==algoid) {
				f=algos[i].run;
				break;	
			}	
		}
		
		if (f!=undefined) {
			var after,before=performance.now();
			f(imgdata1,imgdata2,renderTable);
			after=performance.now();
			console.log("Calculation took %f ms",Math.round((after-before)*10)/10); // Math.round = avoid float f*ckups
		}
		
		empty=[].map.bind(buf32)(function (a,b) {return -16777216; });
		ctx.canvas.onclick=render;
		render();
	}
	
	function render() {
		var bool=(!!clicked++);
		
		buf32.set(empty);
		var tcnt=0;
		var round=Math.floor;
		for (var i=0,arr=renderTable,len=arr.length,a;i<len;++i) {
			a=arr[i];
			if (bool) a.upd();
			buf32[round(a.y) * (WIDTH) + round(a.x)] = a.value;
			if (a.done) tcnt++;
		}
		cnt=tcnt;
		
		image.data.set(buf8);
		
		ctx.putImageData(image,0,0);
		
		if ((bool)&&(clicked>1)) ctx.canvas.onclick=null;
		if (cnt!=renderTable.length) {
			if (bool) requestAnimationFrame(render);
		}else{
			console.log("Done");
		}
	}
	Object.defineProperty(object, "CONVERT" , {
	    get: function() {
	      return CONV;
	    },
	    set: function(value) { 
	      return false;
	    }
  	});
  	
  	Object.defineProperty(object, "getAlgoritms" , {
	    get: function() {
	      return getAlg;
	    },
	    set: function(value) { 
	      return false;
	    }
  	});
	
	return object;
})();