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
var FILES;


// Files:
class Files {
    constructor(id) {
        // Values:
        //this.check_duration = 5000;
        this.lock = true;


        // Private members:
        this.element; // = document.getElementById(id);
        this.list = [];

        this.loading_is_loading;
        this.loading_dots;
        this.loading_dots_limit = 3;

        this.file_selected_id = -1;

        this.sort_is_reverse = false;
        this.sort_option = 0;

        if (document.getElementById(id)) {
            this.element = document.getElementById(id);
            console.info("FILES: Initialization successful.");
        } else
            console.error("FILES: Unable to locate element of id '" + id + "' during initialization process.");

    }

    active(value) {
        this.lock = (value) ? false : true;
    }

    // Ajaxes
    requestList() {
        var self = this;

        $.ajax({
            url: 'data/ajax.php',
            data: {
                request: "files"
            },
            beforeSend: function() {
                self.loadingStart();
            },
            success: function(response) {
                self.loadingEnd();

                if (response == "NO_LOGIN") {
                    INFO.push(INFO_TYPE.WARNING, "You have to be logged in to see this section.");
                } else {
                    //console.log(response);
                    self.list = response.split("</>");

                    for (var i = 0; i < self.list.length; i++) {
                        var listTemp = self.list[i].split("<:>");
                        self.list[i] = [listTemp[0], parseInt(listTemp[1]), listTemp[2]];
                    }

                    self.display();
                }
            },
            error: function() {
                INFO.push(INFO_TYPE.WARNING, "Php error!");
            },
        });
    }

    load() {
        this.requestList();
    }

    display() {
        if (this.list.length < 1)
            this.element.innerHTML = "<div class='row text-center'>There are no files that can be seen by You. <br>Sorry.</div>";
        else {
            var self = this;
            this.list.sort(function(a, b) { return self.sortingFunction(a, b) });

            var complexMessage = "";

            complexMessage += "<iframe id='download_iframe' style='display: none'></iframe>";

            complexMessage += "<table class='table table-striped no-margin-bottom files_table'>";
            complexMessage += "     <thead>";
            complexMessage += "         <tr>";
            complexMessage += "             <th class='files_table_button'> </th>";
            complexMessage += "             <th class='files_table_name'>Name: </th>";
            complexMessage += "             <th class='files_table_size'>Size: </th>";
            complexMessage += "             <th class='files_table_date'>Date: </th>";
            complexMessage += "         </tr>";
            complexMessage += "     </thead>";

            complexMessage += "     <tbody>";

            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i][0] != "#DELETED_FILE#") {
                    complexMessage += "         <tr data-file_id='" + i + "' class='del_file_id_" + i + "'>";
                    complexMessage += "             <td class='text-center show_description'><a class='glyphicon glyphicon-chevron-down'></span></td>";
                    complexMessage += "             <td class='get_file'>" + this.list[i][0] + "</td>";
                    complexMessage += "             <td>" + (this.list[i][1] / 1048576).toFixed(2) + "MB</td>";
                    complexMessage += "             <td>" + this.list[i][2] + "</td>";
                    complexMessage += "         </tr>";
                    complexMessage += "         <tr class='del_file_id_" + i + "'>";
                    complexMessage += "             <td></td>";
                    complexMessage += "             <td colspan='3'>";
                    complexMessage += "                 <div class='description' id='files_table_file_" + i + "'>";
                    complexMessage += "                     <button type='button' class='get_file btn btn-default'>Download</button>";
                    complexMessage += "                     <button type='button' class='delete_file btn btn-danger'>Delete</button>";
                    complexMessage += "                 </div>";
                    complexMessage += "             </td>";
                    complexMessage += "         </tr>";
                } else continue;
            }



            complexMessage += "     </tbody>";
            complexMessage += "</table>";

            this.element.innerHTML = complexMessage;

            // Buttons listeners:
            $(".get_file").on("click", function() {
                var file_id = $(this).parent().data().file_id;
                if (file_id === undefined) file_id = self.file_selected_id;
                self.getFile(file_id);
                //console.log(file_id);
            });

            $(".delete_file").on("click", function() {
                var file_id = $(this).parent().data().file_id;
                if (file_id === undefined) file_id = self.file_selected_id;
                self.deleteFile(file_id);
                //console.log(file_id);
            });


            $(".show_description").on("click", function() {
                var file_id = $(this).parent().data().file_id;
                self.selectFile(file_id);
            });

            $(".files_table_name").click(function() {
                if (!self.lock) {
                    if (self.sort_option == 0) {
                        self.sort_is_reverse = !self.sort_is_reverse;
                    } else {
                        self.sort_option = 0;
                        self.sort_is_reverse = false;
                    }
                    self.display();
                }
            });

            $(".files_table_size").click(function() {
                if (!self.lock) {
                    if (self.sort_option == 1) {
                        self.sort_is_reverse = !self.sort_is_reverse;
                    } else {
                        self.sort_option = 1;
                        self.sort_is_reverse = false;
                    }
                    self.display();
                }
            });

            $(".files_table_date").click(function() {
                if (!self.lock) {
                    if (self.sort_option == 2) {
                        self.sort_is_reverse = !self.sort_is_reverse;
                    } else {
                        self.sort_option = 2;
                        self.sort_is_reverse = false;
                    }
                    self.display();
                }
            });
        }
    }


    deleteFile(id) {
        var self = this;

        $.ajax({
            url: 'data/ajax.php',
            data: {
                request: "delFile",
                fileName: self.list[id][0]
            },
            success: function(response) {
                console.log(response);

                if (response == "OK") {
                    $(".del_file_id_" + id).remove();
                    self.list[id][0] = "#DELETED_FILE#";

                    INFO.push(INFO_TYPE.INFO, "File has been deleted.");
                } else if (response == "NO_FILE") {
                    INFO.push(INFO_TYPE.WARNING, "There is no logner such file.");
                } else if (response == "NO_PERMISSION") {
                    INFO.push(INFO_TYPE.WARNING, "Unable to delete the file. You do not have permission to do that.");
                } else if (response == "NO_LOGIN") {
                    INFO.push(INFO_TYPE.WARNING, "Unable to delete the file. You do have to log in first.");
                }
            },
            error: function() {
                INFO.push(INFO_TYPE.WARNING, "Php error!");
            },
        });
    }


    getFile(id) {
        //console.log(this.list[id][0]);
        var self = this;

        $.ajax({
            url: 'data/ajax.php',
            data: {
                request: "getFile",
                prepare: "YES",
                fileName: self.list[id][0]
            },
            beforeSend: function() {
                INFO.push(INFO_TYPE.INFO, "Downloading started.");
            },
            success: function(response) {
                if (response == "NO_LOGIN") {
                    INFO.push(INFO_TYPE.WARNING, "You have to be logged in to see this section.");
                } else if (response == "NO_FILE") {
                    INFO.push(INFO_TYPE.WARNING, "There is no logner such file.");
                } else {
                    document.getElementById("download_iframe").src = "http://temp.wallet616.tk/data/ajax.php?request=getFile&prepare=NO&fileName=" + self.list[id][0];
                }
            },
            error: function() {
                INFO.push(INFO_TYPE.WARNING, "Php error!");
            },
        });
    }

    selectFile(id) {
        $("#files_table_file_" + this.file_selected_id).css({ "display": "none", "padding-top": "0px" });
        if (this.file_selected_id != id) {
            this.file_selected_id = id;
            $("#files_table_file_" + this.file_selected_id).css({ "display": "block", "padding-top": "8px" });
        } else {
            this.file_selected_id = -1;
        }
    }

    loadingStart() {
        this.loading_dots = 0;

        if (!this.loading_is_loading) {
            this.loading_is_loading = true;

            this.loadingLoop();
        }
    }

    loadingEnd() {
        this.loading_is_loading = false;
    }

    loadingLoop() {
        if (this.loading_is_loading) {
            var self = this;

            var complexMessage = "<div class='row text-center'>Awaiting is infinite";

            this.loading_dots++;
            if (this.loading_dots > this.loading_dots_limit) this.loading_dots = 1;

            for (var i = 0; i < this.loading_dots; i++) complexMessage += ".";
            for (var i = this.loading_dots; i < this.loading_dots_limit; i++) complexMessage += "&#160;";
            complexMessage += "</div>";

            this.element.innerHTML = complexMessage;

            setTimeout(function() {
                self.loadingLoop();
            }, 1000);
        }
    }

    sortingFunction(a, b) {
        if (this.sort_is_reverse) {
            if (a[this.sort_option] > b[this.sort_option]) return -1;
            else return 1;
        } else {
            if (a[this.sort_option] > b[this.sort_option]) return 1;
            else return -1;
        }
    }
}


// Ready
$(document).ready(function() {
    FILES = new Files("panel_files");
});