function Pixel() {}
Pixel.prototype.value = 0;
Pixel.prototype.x = 0;
Pixel.prototype.y = 0;
Pixel.prototype.gx = 0; // goal x
Pixel.prototype.gy = 0; // goal y
Pixel.prototype.spdx = 1;
Pixel.prototype.spdy = 1;
Pixel.prototype.done = false;
Pixel.prototype.occupied = false;
Pixel.prototype.upd = function () {
	var gy = this.gy,
	y = this.y,
	gx = this.gx,
	x = this.x,
	spdx = this.spdx,
	spdy = this.spdy,
	done = this.done,
	abs = Math.abs,
	atan2 = Math.atan2,
	cos = Math.cos,
	sin = Math.sin;
	var rad = atan2(gy - y, gx - x);
	if ((spdx === 0) && (spdy === 0))
		done = true;
	if (abs(x - gx) < 1) {
		spdx = 0;
		x = gx;
	} else {
		x += cos(rad) * spdx;
	}
	if (Math.abs(y - gy) < 1) {
		spdy = 0;
		y = gy;
	} else {
		y += sin(rad) * spdy;
	}
	this.gx = gx;
	this.gy = gy;
	this.x = x;
	this.y = y;
	this.spdx = spdx;
	this.spdy = spdy;
	this.done = done;
};
