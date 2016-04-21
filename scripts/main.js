function loadImage(callback){
    get('open-image').onchange = function(e){
        var fileExtension = e.target.files[0].name.split('.')[1].toLowerCase();
        if(fileExtension == "jpg" || fileExtension == "jpeg" || fileExtension == "png"){
            var fileReader = new FileReader();

            alertify.warning('<span class="fa fa-spin fa-spinner"></span> Loading image');

            fileReader.readAsDataURL(e.target.files[0]);
            fileReader.onloadend  = function () {
				callback(fileReader.result);
            };
        }
        else alertify.error("Sorry but, you cannot open ." + fileExtension + " files!");
    }
}

function saveImage(imgPath, filters, callback){
            alertify.warning('<span class="fa fa-spin fa-spinner"></span> Processing original image');
                var fd = new FormData(),
                    xhr = new XMLHttpRequest();

                fd.append('path', imgPath);
                fd.append('filters', JSON.stringify(filters));

                xhr.open("POST", "/applyfilters", true);
                xhr.send(fd);
                xhr.onreadystatechange = function(){
                    if (xhr.readyState == 4 && xhr.status == 200){
                        var imagePath = xhr.responseText;
                        callback(JSON.parse(imagePath).finalImage);
                    }
                    else if(xhr.status == 500){
                        alertify.error("Image could not be saved!");
                    }
                };
}

function adjustToolbox(){
            var visibleHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
            get('toolbox').style.height = (visibleHeight - 20) + "px";
            get('toolbox-components').style.height = visibleHeight + "px";
}

function removeFilterFromList(filterList, filter){
    var removeIndex = -1;
    for(var i = 0; i < filterList.length; i++)
    if(filterList[i].filter == filter){
        removeIndex = i;
        break;
    }
    if(removeIndex >= 0)
        filterList.splice(removeIndex, 1);
    return filterList;
}

function addOrUpdateFilterList(filterList, filter, priority){
    var filterIndex = -1;
    for(var i = 0; i < filterList.length; i++)
        if(filterList[i].filter == filter.filter){
            filterIndex = i;
            break;
        }
    if(filterIndex === -1)
        filterList.push(filter);
    else {
        filterList[filterIndex].value = filter.value;
        filterList[filterIndex].priority = filter.priority;
    }
    return filterList;
}

window.onload = function () {
    $(".nano").nanoScroller();

    var myCanvasId = 'working-canvas';

    // reset inputs
    var rangeInputs = document.querySelectorAll('input[type=range]');
    for (var i = 0; i < rangeInputs.length; i++)
        rangeInputs[i].value = 0;

    adjustToolbox();
    window.onresize = function(){
        adjustToolbox();
    }


    loadImage(function(base64){
            alertify.success('Image loaded succesfully!');

            new imgstry(myCanvasId, base64, function(processor){
                var canvas = processor.canvas;

                fitToPage(canvas);
                centerPage(canvas, (window.outerWidth > 320 ? -370 : 0));
                dragable(canvas);
                zoomIn(canvas, true);

                // enter the stage with style
                canvas.addClass('enter-stage');

                setTimeout(function(){
                    canvas.style.opacity = 1;
                    canvas.removeClass('enter-stage');
                }, 1050);

                if(get('toggle-histogram').hasClass('tool-active'))
                    processor.drawHistogram('working-canvas-histogram');

                // resize image if window shrinks
                window.onresize = function(){
                    adjustToolbox();
                    get('right-pane').style.height = window.outerHeight;
                    centerPage(canvas, (window.outerWidth > 320 ? -370 : 0));
                    fitToPage(canvas);
                }

                var filtersOptions = new Array(),
                    currentFilterPriority = 0;

                //saveCanvasImage(canvas, 'save-image');
                get('save-image').onclick = function(e){
					get(this).href = Canvas2Image.saveAsJPEG(canvas);

					// clear ref after 1 second to eliminate hyperlink overlay on mousehover
					setTimeout(function(){
						get('save-image').href = "#";
					}, 1000);
                }

                get('toggle-histogram').onclick = function(){
                    if(this.hasClass('tool-active')){
                        this.removeClass('tool-active');
                        get('working-canvas-histogram').style.display = 'none';
                    }
                    else{
                        this.addClass('tool-active');
                        get('working-canvas-histogram').style.display = 'block';
                    }
                };

                // activate toggleable filters
                var toggleableFilters = document.getElementsByClassName('filter-toggleable');
                for(var i = 0; i < toggleableFilters.length; i++)
                    toggleableFilters[i].onclick = function() {
                        if(this.dataset.active == "true"){
                            this.removeClass("tool-active");
                            this.dataset.active = "false";
                            filtersOptions = removeFilterFromList(filtersOptions, this.dataset.filter);

                        }
                        else{
                            this.addClass("tool-active");
                            this.dataset.active = "true";
                            var that = this;
                            filtersOptions = addOrUpdateFilterList(filtersOptions, {
                                                filter: that.dataset.filter,
                                                value: that.value,
                                                priority: currentFilterPriority++
                                            });
                        }
                        processor.batchWorker(filtersOptions, function(){
                            if(get('toggle-histogram').hasClass('tool-active'))
                                processor.drawHistogram('working-canvas-histogram');
                        });
                    }

                // value inputs
                var values = document.getElementsByClassName('value');
                var inputTimeout;
                for(var i = 0; i < values.length; i++)
                    values[i].addEventListener('input', function(){
                        clearTimeout(inputTimeout);

                        var that = this;

                        setTimeout(function(){
                            var input = that.previousElementSibling;
                            input.value = parseInt(that.innerHTML);

                            if ("createEvent" in document) {
                                var evt = document.createEvent("HTMLEvents");
                                evt.initEvent("change", true, true);
                                input.dispatchEvent(evt);
                            }
                            else
                                input.fireEvent("onchange");

                        }, 700);
                    }, false);

                // reset filters
                var resets = document.getElementsByClassName('fa-refresh');
                for(var i = 0; i < resets.length; i++)
                    resets[i].onclick = function(){
                        var input = this.parentElement.parentElement.lastElementChild.previousElementSibling;
                        this.parentElement.parentElement.lastElementChild.innerHTML = '0';
                        input.value = 0;

                        if ("createEvent" in document) {
                            var evt = document.createEvent("HTMLEvents");
                            evt.initEvent("change", true, true);
                            input.dispatchEvent(evt);
                        }
                        else
                            input.fireEvent("onchange");
                    };

                // activate filters
                var filters = document.getElementsByClassName('filter');
                for(var i = 0; i < filters.length; i++)
                    filters[i].onchange = function(){
                        this.parentNode.lastElementChild.innerHTML = this.value;
                        if(this.value == 0){
                            this.dataset.active = "false";
                            filtersOptions = removeFilterFromList(filtersOptions, this.dataset.filter);
                        }
                        else{
                            this.dataset.active = "true";
                            var that = this;
                            filtersOptions = addOrUpdateFilterList(filtersOptions, {
                                                filter: that.dataset.filter,
                                                value: that.value,
                                                priority: currentFilterPriority++
                                            });
                        }
                        document.querySelector('.alertify-notifier.ajs-top.ajs-left').innerHTML = "";
                        processor.batchWorker(filtersOptions, function(){
                            if(get('toggle-histogram').hasClass('tool-active'))
                                processor.drawHistogram('working-canvas-histogram');
                        });
                    };
            });
    });
};
