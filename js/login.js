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
var keypad;


// Key pad:
class KeyPad {
    constructor(id) {
        // Values:
        this.size = 350; // Size of whole keypad (in pixels).
        this.p_size_circle = 0.1; // Size of the circle, procentage of this.size.
        this.p_size_hitbox = 1.3; // Percentage size of circle, used as hitbox.
        this.keys_amount = 8; // Max password (pin) length that is sent to php.

        this.lock = false; // Locks/unlocks keypad panel (including login requests, handling events).

        // Procentage position of circle in keypad.
        this.p_distance = {
            // id: [posiotionX, posiotionY]
            7: [0.2, 0.33],
            8: [0.5, 0.15],
            9: [0.8, 0.33],
            5: [0.5, 0.5],
            1: [0.2, 0.67],
            2: [0.5, 0.85],
            3: [0.8, 0.67]
        };



        // Initialization:
        this.canvas;
        if (document.getElementById(id)) {
            this.canvas = document.getElementById(id);
            console.info("KEYPAD: Initialization successful.");
        } else
            console.error("KEYPAD: Unable to locate element of id '" + id + "' during initialization process.");

        this.ctx = this.canvas.getContext("2d");
        this.canvas.height = this.size;
        this.canvas.width = this.size;
        this.keys = [];
        var self = this;
        // Information about current circle animation stage.
        this.animation = {
            // id: [isAnimated, currentStage, colorTimer]
            7: [false, 0, 0],
            8: [false, 0, 0],
            9: [false, 0, 0],
            5: [false, 0, 0],
            1: [false, 0, 0],
            2: [false, 0, 0],
            3: [false, 0, 0]
        };

        $(this.canvas).click(function(event) {
            if (!self.lock)
                self.click(event);
        });

        $(document).keypress(function(event) {
            if (!self.lock)
                self.keypress(event);
        });

        for (var i = 0; i < this.keys_amount; i++) {
            this.keys.push("0");
        }

        this.reDraw();
    }

    reDraw() {
        // Cleaning.
        this.ctx.clearRect(0, 0, this.size, this.size);


        // Circles.
        for (var pos in this.p_distance) {
            this.drawCircle(pos);
        }

        // Loop.
        var self = this;
        setTimeout(function() {
            self.reDraw();
        }, 40);
    }

    drawCircle(pos) {
        var circle_size = this.size * this.p_size_circle;

        this.ctx.save();

        this.ctx.beginPath();
        this.ctx.arc(this.p_distance[pos][0] * this.size, this.p_distance[pos][1] * this.size, circle_size, 0, 2 * Math.PI);

        if (this.animation[pos][0]) {
            if (this.animation[pos][1] == 0) {
                this.animation[pos][2] += 25;

                if (this.animation[pos][2] > 255) {
                    this.animation[pos][2] = 255;
                    this.animation[pos][1] = 2;
                }

            } else if (this.animation[pos][1] == 2) {
                this.animation[pos][2] -= 25;

                if (this.animation[pos][2] < 0) {
                    this.animation[pos][2] = 0;
                    this.animation[pos][1] = 0;
                    this.animation[pos][0] = false;
                }
            }

        }

        this.ctx.fillStyle = "rgba(" + this.animation[pos][2] + "," + this.animation[pos][2] + "," + this.animation[pos][2] + ", 0.2)";

        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.restore();
    }

    click(event) {
        //console.log(event);
        var event_pos = this.getMousePos(event);

        for (var pos in this.p_distance) {
            var distance = Math.sqrt(Math.pow(event_pos.x - this.p_distance[pos][0] * this.size, 2) + Math.pow(event_pos.y - this.p_distance[pos][1] * this.size, 2));
            if (distance < this.size * this.p_size_hitbox * this.p_size_circle) {

                this.animation[pos][1] = 0;
                this.animation[pos][0] = true;

                this.pushKey(pos);
            }

        }
    }

    getMousePos(event) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    keypress(event) {
        if (event.key in this.p_distance) {
            this.animation[event.key][1] = 0;
            this.animation[event.key][0] = true;
            this.pushKey(event.key);
        }

    }

    pushKey(key) {
        this.keys.shift();
        this.keys.push(key);

        //console.log(this.keys);
        this.requestLogin();
    }

    // Ajaxes
    requestLogin() {
        $.ajax({
            url: 'data/ajax.php',
            data: {
                request: "login",
                key: this.keys.toString()
            },
            success: function(response) {
                if (response == 'OK') {
                    bg.setDestination(2);
                    navigation.setDestination("panel_logged");
                    menu($($("#menu_list").children()[0]).children()[0], 'files');
                    keypad.lock = true;

                    $("#description_logo").text("You are in.");
                } else if (response == "NO_OK") {
                    //console.log('Bummer: No matching pin found.');
                } else {
                    INFO.push(INFO_TYPE.WARNING, "Php error!");
                };
            },
            error: function() {
                INFO.push(INFO_TYPE.WARNING, "Php error!");
            },
        });
    };
}



function logout() {
    $.ajax({
        url: 'data/ajax.php',
        data: {
            request: "logout"
        },
        success: function(response) {
            if (response == 'OK') {
                bg.setDestination(1);
                navigation.setDestination("panel_login");
                $("#description_logo").text("You should consider logging in.");
                INFO.push(INFO_TYPE.INFO, "You has been succesfully logged out.");

                if (keypad)
                    keypad.lock = false;
                else
                    keypad = new KeyPad("keypad");

            } else {
                INFO.push(INFO_TYPE.WARNING, "Unable to logout!");
            }
        },
        error: function() {
            INFO.push(INFO_TYPE.WARNING, "Php error!");
        },
    });
}


// Globla variable.
var current_menu;

function menu(obj, option) {
    $(current_menu).parent().removeClass("active");
    current_menu = obj;
    $("#panel_all").children().each(function() {
        $(this).css("display", "none");
    });

    // Disable all key handlers.
    FILES.active(false);

    // Switch menu tab.
    switch (option) {
        case 'logout':
            logout();
            break;

        case 'files':
            $(current_menu).parent().addClass("active");
            FILES.active(true);
            FILES.requestList();
            break;

        case 'accounts':
            $(current_menu).parent().addClass("active");
            break;

        default:
            break;
    }

    $("#panel_" + option).css("display", "block");
}



// Ready
$(document).ready(function() {
    $("#no_js").css("display", "none");
    $("#panel_all").children().each(function() {
        $(this).css("display", "none");
    });

    $.ajax({
        url: 'data/ajax.php',
        data: {
            request: "logged"
        },
        success: function(response) {
            if (response == 'OK') {
                bg.setDestination(2);
                navigation.setDestination("panel_logged");
                menu($($("#menu_list").children()[0]).children()[0], 'files');
                INFO.push(INFO_TYPE.INFO, "Session restored.");

                $("#description_logo").text("Session restored.");
            } else if (response = 'NO_OK') {
                keypad = new KeyPad("keypad");
                $("#description_logo").text("You should consider logging in.");
            }
        },
        error: function() {
            INFO.push(INFO_TYPE.WARNING, "Php error!");
        },
    });
});