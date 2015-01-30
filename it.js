var CONVERTOR = (function () {
	var ctx,
	/* CanvasRenderingContext2D */
	renderTable,
	/* Array */
	WIDTH = 0,
	/* Int */
	HEIGHT = 0,
	/* Int */
	image,
	/* ImageData */
	buf32,
	/* new Uint32Array */
	clicked = 0,
	/* Int */
	aniFrame = -1,
	/* Int */
	empty,
	/* Array */
	algos = [],
	/* Array */
	object = {};
	/* Object */

	if (!window.performance)
		performance = {};

	performance.now = performance.now || function () {};

	function getData(a) {
		var ctx2;
		(ctx2 = document.createElement("canvas").getContext("2d")).canvas.width = a.width;
		ctx2.canvas.height = a.height;
		ctx2.drawImage(a, 0, 0);
		return ctx2.getImageData(0, 0, a.width, a.height);
	}

	// alg 1
	algos.push({
		name : "Sorted brightness (fastest)",
		id : "sortbw",
		run : function (imgdata1, imgdata2, renderTable) {
			function sortAndDoStuff(bool, d) {
				return [].map.bind(new Uint32Array(d.data.buffer))(function (a, b) {
					if (bool) {
						var pix = new Pixel();
						pix.x = (WIDTH - d.width) / 2 + (b % (d.width));
						pix.y = (HEIGHT - d.height) / 2 + ~~(b / (d.width));
						pix.value = a;
						renderTable.push(pix);
					}
					return [b, (d.data[b * 4 + 0] + d.data[b * 4 + 1] + d.data[b * 4 + 2]) / 3]
				}).sort(function (a, b) {
					return a[1] - b[1];
				}).map(function (a, b) {
					return a[0];
				});
			}

			var sortArray1 = sortAndDoStuff(true, imgdata1);
			var sortArray2 = sortAndDoStuff(false, imgdata2);

			for (var i = 0, img2w = imgdata2.width, img2h = imgdata2.height, len = sortArray1.length; i < len; i++) {
				var rT = renderTable[sortArray1[i]];
				var nRT = sortArray2[i];
				rT.gx = (WIDTH - img2w) / 2 + (nRT % (img2w));
				rT.gy = (HEIGHT - img2h) / 2 + ~~(nRT / (img2w));
			}
		}
	});

	// alg 1
	algos.push({
		name : "Sorted brightness [Inverted] (fast)",
		id : "sortbwINVERT",
		run : function (imgdata1, imgdata2, renderTable) {
			function sortAndDoStuff(bool, d) {
				return [].map.bind(new Uint32Array(d.data.buffer))(function (a, b) {
					if (bool) {
						var pix = new Pixel();
						pix.x = (WIDTH - d.width) / 2 + (b % (d.width));
						pix.y = (HEIGHT - d.height) / 2 + ~~(b / (d.width));
						pix.value = a;
						renderTable.push(pix);
					}
					return [b, (d.data[b * 4 + 0] + d.data[b * 4 + 1] + d.data[b * 4 + 2]) / 3]
				}).sort(function (a, b) {
					return a[1] - b[1];
				}).map(function (a, b) {
					return a[0];
				});
			}

			var sortArray1 = sortAndDoStuff(true, imgdata1);

			var sortArray2 = sortAndDoStuff(false, imgdata2);

			for (var i = 0, img2w = imgdata2.width, img2h = imgdata2.height; i < sortArray1.length; i++) {
				var rT = renderTable[sortArray1[i]];
				var nRT = sortArray2[(sortArray2.length - 1) - i];
				rT.gx = (WIDTH - img2w) / 2 + (nRT % (img2w));
				rT.gy = (HEIGHT - img2h) / 2 + ~~(nRT / (img2w));
			}
		}
	});

	// alg 1
	algos.push({
		name : "Sorted brightness [Messed modulo] (fast)",
		id : "sortbwMODULO",
		run : function (imgdata1, imgdata2, renderTable) {
			function sortAndDoStuff(bool, d) {
				return [].map.bind(new Uint32Array(d.data.buffer))(function (a, b) {
					if (bool) {
						var pix = new Pixel();
						pix.x = (WIDTH - d.width) / 2 + (b % (d.width));
						pix.y = (HEIGHT - d.height) / 2 + ~~(b / (d.width));
						pix.value = a;
						renderTable.push(pix);
					}
					return [b, (d.data[b * 4 + 0] + d.data[b * 4 + 1] + d.data[b * 4 + 2]) / 3]
				}).sort(function (a, b) {
					return a[1] - b[1];
				}).map(function (a, b) {
					return a[0];
				});
			}

			var sortArray1 = sortAndDoStuff(true, imgdata1);

			var sortArray2 = sortAndDoStuff(false, imgdata2);

			for (var i = 0, img2w = imgdata2.width, img2h = imgdata2.height; i < sortArray1.length; i++) {
				var rT = renderTable[sortArray1[i]];
				var nRT = sortArray2[(~~(sortArray2.length / 2) + i) % sortArray2.length];
				rT.gx = (WIDTH - img2w) / 2 + (nRT % (img2w));
				rT.gy = (HEIGHT - img2h) / 2 + ~~(nRT / (img2w));
			}
		}
	});

	function getAlg(f) {
		for (var i = 0; i < algos.length; i++) {
			f(algos[i].name, algos[i].id);
		}
	}
	function CONV(algoid, canvas, image1, image2) {
		if (aniFrame != -1) {
			cancelAnimationFrame(aniFrame);
			aniFrame = -1;
		}
		ctx = null;

		ctx = canvas.getContext("2d");

		imgdata1 = getData(image1);
		imgdata2 = getData(image2);

		clicked = 0;
		WIDTH = Math.max(image1.width, image2.width);
		HEIGHT = Math.max(image1.height, image2.height);
		canvas.width = (WIDTH);
		canvas.height = (HEIGHT);
		image = ctx.createImageData((WIDTH), (HEIGHT));
		buf32 = new Uint32Array(image.data.buffer);

		renderTable = [];
		var f = undefined;
		for (var i = 0; i < algos.length; i++) {
			if (algos[i].id == algoid) {
				f = algos[i].run;
				break;
			}
		}

		if (f != undefined) {
			var after,
			before = performance.now();
			f(imgdata1, imgdata2, renderTable);
			after = performance.now();
			console.log("Calculation took %f ms", Math.round((after - before) * 10) / 10); // Math.round = avoid float f*ckups
		}

		empty = [].map.bind(buf32)(function (a, b) {
			return -16777216;
		});
		ctx.canvas.onclick = render;
		render();
	}

	function render() {
		var bool = (!!clicked++);

		buf32.set(empty);
		var tcnt = 0;
		for (var i = 0, arr = renderTable, len = arr.length, a; i < len; ++i) {
			a = arr[i];
			if (bool)
				a.upd();
			buf32[~~(a.y) * (WIDTH) + ~~(a.x)] = a.value;
			if (a.done)
				tcnt++;
		}

		ctx.putImageData(image, 0, 0);

		if ((bool) && (clicked > 1))
			ctx.canvas.onclick = null;
		if (tcnt != renderTable.length) {
			if (bool)
				aniFrame = requestAnimationFrame(render);
		} else {
			console.log("Done");
		}
	}
	Object.defineProperty(object, "CONVERT", {
		get : function () {
			return CONV;
		},
		set : function (value) {
			return false;
		}
	});

	Object.defineProperty(object, "getAlgoritms", {
		get : function () {
			return getAlg;
		},
		set : function (value) {
			return false;
		}
	});

	return object;
})();
