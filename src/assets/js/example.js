var a, o, r, s = e(24), h = e(3), u = e(20), l = t.extend({}, t.Events, {
                init: function() {
                    this.$main = $("#main"),
                    h.init(),
                    u.init(this.$main),
                    this.stage = new i.Stage({
                        el: $("#three")[0]
                    }),
                    this.stage.size(640, window.innerHeight).update(),
                    this.root = new i.Sprite,
                    this.root.position(0, 0, -600).update(),
                    this.stage.addChild(this.root),
                    s.init(this.root),
                    this.resize(),
                    this.ready()
                },
                isReady: !1,
                ready: function() {
                    if (!this.isReady) {
                        this.isReady = !0;
                        var t = this;
                        if (ua.android) {
                            var i = function() {
                                $("#bgm")[0].play(),
                                $("body").off("touchend", i)
                            };
                            $("body").on("touchend", i)
                        } else
                            $("#bgm")[0].play();
                        s["in"](),
                        !function() {
                            e.e(0, function(i) {
                                var e = [i(21), i(22), i(23)];
                                (function(i, e, n) {
                                    a = i,
                                    o = e,
                                    r = n,
                                    t.complete()
                                }
                                ).apply(null, e)
                            })
                        }(e)
                    }
                },
                complete: function() {
                    function t() {
                        p = !1,
                        e()
                    }
                    function i() {
                        p = !0,
                        A && cancelAnimationFrame(A)
                    }
                    function e() {
                        A = requestAnimationFrame(e);
                        var t = (d.lon + f.lon + c.lon) % 360
                          , i = .35 * (d.lat + f.lat + c.lat);
                        t - l.root.panoBg.rotationY > 180 && (l.root.panoBg.rotationY += 360),
                        t - l.root.panoBg.rotationY < -180 && (l.root.panoBg.rotationY -= 360);
                        var n = t - l.root.panoBg.rotationY
                          , a = i - l.root.panoBg.rotationX;
                        Math.abs(n) < .1 ? l.root.panoBg.rotationY = t : l.root.panoBg.rotationY += .3 * n,
                        Math.abs(a) < .1 ? l.root.panoBg.rotationX = i : l.root.panoBg.rotationX += .15 * a,
                        l.root.panoBg.updateT(),
                        l.root.panoDots.rotationY = l.root.panoBg.rotationY,
                        l.root.panoDots.rotationX = l.root.panoBg.rotationX,
                        l.root.panoDots.updateT(),
                        l.root.panoSky.rotationY = l.root.panoBg.rotationY - 90,
                        l.root.panoSky.rotationX = l.root.panoBg.rotationX,
                        l.root.panoSky.updateT(),
                        t - l.root.panoItems.rotationY > 180 && (l.root.panoItems.rotationY += 360),
                        t - l.root.panoItems.rotationY < -180 && (l.root.panoItems.rotationY -= 360);
                        var o = t - l.root.panoItems.rotationY
                          , r = i - l.root.panoItems.rotationX;
                        Math.abs(o) < .1 ? l.root.panoItems.rotationY = t : l.root.panoItems.rotationY += .25 * o,
                        Math.abs(r) < .1 ? l.root.panoItems.rotationX = i : l.root.panoItems.rotationX += .15 * r,
                        l.root.panoItems.updateT();
                        var s = -150 - 20 * Math.abs(n);
                        l.root.z += .1 * (s - l.root.z),
                        l.root.updateT(),
                        h(l.root.panoDots.rotationY)
                    }
                    function h(t) {
                        var i = (-180 - t) % 360;
                        i = i > 0 ? i - 360 : i;
                        for (var e = 0, a = l.root.panoDots.children.length; a > e; e++) {
                            var o = l.root.panoDots.children[e];
                            o.r0 > i - 5 && o.r0 < i + 25 ? 0 == o.label.width && (n.kill(o.label),
                            n.to(o.label, .3, {
                                width: o.w0,
                                ease: n.Quad.Out,
                                onUpdate: function() {
                                    this.target.updateS()
                                }
                            })) : o.label.width == o.w0 && (n.kill(o.label),
                            n.to(o.label, .3, {
                                width: 0,
                                ease: n.Quad.Out,
                                onUpdate: function() {
                                    this.target.updateS()
                                }
                            }))
                        }
                    }
                    var l = this;
                    a.init(this.$main),
                    r.init(this.$main),
                    s.out(),
                    o.init(l.root),
                    s.on("out", function() {
                        n.to(l.root, 4, {
                            z: -150,
                            ease: n.Quad.InOut,
                            onUpdate: function() {
                                this.target.updateT()
                            }
                        }),
                        n.to(l.stage.camera, 4, {
                            fov: 60,
                            ease: n.Quad.InOut,
                            onUpdate: function() {
                                this.target.updateT()
                            }
                        }),
                        o["in"]()
                    }),
                    a.on("navOn", function() {
                        i(),
                        n.to(l.stage.el, .3, {
                            x: -200,
                            ease: n.Quad.Out
                        })
                    }),
                    a.on("navOff", function() {
                        t(),
                        n.to(l.stage.el, .3, {
                            x: 0,
                            ease: n.Quad.Out
                        })
                    }),
                    a.on("item", function(t) {
                        r.popOn(t)
                    }),
                    o.on("over", function() {
                        t(),
                        a.$el.css({
                            display: "block"
                        }),
                        "invitation" == window.ups.act && r.popOn(1)
                    }),
                    o.on("dot", function(t) {
                        r.popOn(t)
                    }),
                    r.on("popOn", function() {
                        i()
                    }),
                    r.on("popOff", function() {
                        t()
                    });
                    var c = {
                        lon: 0,
                        lat: 0
                    };
                    u.on("move", function(t) {
                        p || (c.lon = (c.lon - .2 * t.ax) % 360,
                        c.lat = Math.max(-90, Math.min(90, c.lat + .2 * t.ay)))
                    });
                    var A, d = {
                        lat: 0,
                        lon: 0
                    }, f = {
                        lon: 0,
                        lat: 0
                    }, p = !0, g = new Orienter;
                    g.handler = function(t) {
                        d.lat = t.lat,
                        d.lon = -t.lon,
                        p && (f.lat = -d.lat,
                        f.lon = -d.lon)
                    }
                    ,
                    g.init()
                },
                resize: function() {
                    var t = this;
                    setTimeout(function() {
                        t.stage.size(640, window.innerHeight).update()
                    }, 500)
                },
                shareOn: function() {
                    var t = $("#share");
                    t.css({
                        display: "block"
                    }),
                    n.to(t, .3, {
                        opacity: 1
                    })
                },
                shareOff: function() {
                    var t = $("#share");
                    n.to(t, .3, {
                        opacity: 0,
                        onEnd: function() {
                            this.target.style.display = "none"
                        }
                    })
                }
            });
            l.init()