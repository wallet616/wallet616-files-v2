/*
 * Created by: wallet616
 * Version: 0.01
 * 
 * Description:
 * 	Plik prywatny. Nie zezwalam nikomu na kopiowanie 
 * 	jego zawartosci, albo czesci jego zawartosci.
 * 	
 * 	This is a private file. I do not allow 
 * 	anybody to copy content or part of content, of this file.
 * 	If you are interested in creating something similar for You,
 * 	just write to me mail.
 * 
 */


// Global objects:
var bg;
var fg;
var navigation;


// Background class:
class Bg {
    constructor(id) {
        // Values:
        this.element = document.getElementById(id);
        this.height = 0;
        this.width = 0;
        this.speed = 20;
        this.refTime = 100;

        this.current_pos_x = 0.0;
        this.destination_pos_x = 0.0;
        this.destination_chart = 0;
        this.move_need = true;
        this.timer = 0.0;

        $(this.element).css({
            "position": "fixed",
            "margin": "0",
            "padding": "0",
            "z-index": "-100",
            "background-size": "100% 100%",
            "background-repeat": "no-repeat",
            "background-position": "center",
            "background-image": "url(img/bg.jpg)"
        });

        this.reDraw();
    }

    resize() {
        if (this.width != window.innerWidth || this.height != window.innerHeight) {
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            $(this.element).css({
                "width": 1.2 * this.width,
                "height": this.height
            });

            this.move_need = true;
            this.refTime = 20;
        }
    }

    reDraw() {
        this.resize();

        if (this.move_need) {
            this.calcDestination();

            this.current_pos_x += (this.destination_pos_x - this.current_pos_x) * (1.0 / this.speed);

            var dist = this.destination_pos_x - this.current_pos_x;
            if (dist * dist < 2.0) {
                this.current_pos_x = this.destination_pos_x;
                this.move_need = false;

                this.refTime = 100;
            }

            $(this.element).css({
                "left": -this.current_pos_x,
            });
        }



        var self = this;
        setTimeout(function() {
            self.reDraw();
        }, self.refTime);
    }

    setDestination(id) {
        this.move_need = true;
        this.destination_chart = id;
        this.refTime = 20;
    }

    calcDestination() {
        switch (this.destination_chart) {
            case 0:
                this.destination_pos_x = 0.0;
                this.speed = 10;
                break;

            case 1:
                this.destination_pos_x = 0.06 * this.width;
                this.speed = 200;
                //console.log("this.destination_pos_x: " + this.destination_pos_x);
                break;

            case 2:
                this.destination_pos_x = 0.2 * this.width;
                this.speed = 10;
                //console.log("this.destination_pos_x: " + this.destination_pos_x);
                break;

            default:
                this.destination_pos_x = 0.0;
                this.speed = 100;
                break;
        }
    }
}

// Foreground:
class Fg {
    constructor(id) {
        this.element = document.getElementById(id);
        this.height = 0;
        this.width = 0;

        this.speed = 20;
        this.timer = 1.0;
        this.changed = true;

        $(this.element).css({
            "z-index": "100",
            "background-image": "none",
            "position": "fixed",
            "margin": "0",
            "padding": "0",
            "display": "block"
        });

        this.reDraw();
    }

    resize() {
        if (this.width != window.innerWidth || this.height != window.innerHeight) {
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            $(this.element).css({
                "width": this.width,
                "height": this.height
            });
        }
    }

    reDraw() {
        if (this.changed) {
            this.resize();

            this.timer -= 0.03;

            if (this.timer < 0) {
                this.timer = 0.0;
                this.changed = false;
                $(this.element).css({ "display": "none" });
            }

            $(this.element).css({ "background-color": "rgba(0, 0, 0, " + this.timer + ")" });

            var self = this;
            setTimeout(function() {
                self.reDraw();
            }, self.speed);
        }
    }
}

// Menu tabs.
class Navigation {
    constructor() {
        this.refTime = 100;
        this.changed = true;
        this.speed = 20;
        this.timer = 0.0;
        this.stage = 0;

        this.reDraw();
    }

    setDestination(id) {
        this.destination = id;
        this.changed = true;
        this.refTime = 20;
        this.stage = 0;
    }

    reDraw() {
        if (this.changed) {
            switch (this.stage) {
                case 0:
                    this.timer -= 0.03;

                    var self = this;

                    if (this.timer < 0.0) {
                        this.timer = 0.0;
                        this.stage = 1;
                        $("#panels_all").children().each(function() {
                            $(this).css({ "display": "none" });
                        });
                    }

                    $("#panels_all").children().each(function() {
                        $(this).css({ "opacity": self.timer });
                    });

                    break;

                case 1:
                    this.timer += 0.03;

                    if (this.timer > 1.0) {
                        this.timer = 1.0;
                        this.changed = false;
                        this.refTime = 100;
                    }

                    $("#" + this.destination).css({
                        "display": "block",
                        "opacity": this.timer
                    });

                    break;
            }
        }

        var self = this;
        setTimeout(function() {
            self.reDraw();
        }, self.refTime);
    }
}



// Ready
$(document).ready(function() {
    bg = new Bg("bg_full");
    fg = new Fg("fg_full");
    navigation = new Navigation();

    bg.setDestination(1);
    navigation.setDestination("panel_login");
});