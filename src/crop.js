/**
 * A wrapper for cropping images
 * Unminified version for the cropy code
 * Version- 1.0
 * Date- 01/06/19
 * Written by- Shaun Murphy
 */
var ImageCrop = (function ImageCrop() {
    /**
     * Return the constructor for library
     * object
     */
    return function MyLibConstructor(obj) {
        var _this = this;
        _privateObject = Object.assign(_privateObject, obj);

        //Adding modal div in body
        document.body.innerHTML += _privateObject.cropModal || _privateObject.getCropModal();

        /**
         * Initialising crop object
         */
        _this.initCrop = function(input){
            _privateObject.input = input;
            var selector = document.getElementById('crop_demo');

            //Checking validations
            if(_this.checkValidations()){
                $image_crop = new Croppie(selector, _privateObject);

                _this.showCropModal();       
            }
        }  //end init crop definiton

        /**
         * Validations for uploaded file satisfy the given filetype conditions
         * @return boolean
         */
        _this.checkValidations = function(){
            var invalid    = 0;
            validTypes   = _privateObject.validTypes.split('|'),
            uploadedFileType = _privateObject.input.files[0].type;

            //Checking if uploaded file is valid
            if(!validTypes.includes(uploadedFileType.replace('image/', ''))){
                alert(`You uploaded an invalid file`);

                ++invalid;
            }

            return invalid ? false : true;
        }  //end validations definiton

        /**
         * Show the crop modal
         */
        _this.showCropModal = function () {
            _this.fileReader(_privateObject.input.files[0], (event) => {
                $image_crop.bind({
                    url: event.target.result
                });
            });

            document.getElementById('cropModal').style.display = 'block';
        };  //end crop modal definiton

        /**
         * Get the source of image after cropping
         * @return string
         */
        _this.getSourceBlob = function () {
            return _privateObject;
        }; //end source blob definiton

        /**
         * Function for reading out files
         * based on FileReader API
         */
        _this.fileReader = function (file, onloadCallback) {
            var reader = new FileReader();

            reader.readAsDataURL(file);
            reader.onload = onloadCallback
        }; //end file reader definiton

        /**
         * Set up the crop object after cropping
         */
        _this.setCropObject = function(blob){
            _privateObject.cropData = blob;
        };

        /**
         * Get crop object after cropping
         */
        _this.getData = function(){
            return _privateObject.cropData;
        };  

        /**
         * When user clicked on crop
         */
        document.getElementById('crop_image').addEventListener('click', function(){
            var modal = document.getElementById('cropModal');

            $image_crop.result(_privateObject.imageResult)
            .then(function(croppedImage) {
                if(_privateObject.showPreview){
                    switch(_privateObject.imageResult.type){
                        //If base64 given
                        case 'base64' :

                        var i = 0,
                        elem = document.querySelectorAll(`${_privateObject.imagePreview} img`);

                        //Preview image on all elements
                        while(i < elem.length){
                            elem[i].src = croppedImage;

                            ++i;
                        } //end while

                        _privateObject.cropData = croppedImage;                    
                        break;

                        //If html given
                        case 'html' :

                        //If class given for preview
                        if(_privateObject.imagePreview.includes('.')){
                            var i =0,
                            elem = document.getElementsByClassName((`${_privateObject.imagePreview}`).replace('.', ''));

                            //Preview image on all elements
                            while(i < elem.length){
                                elem[i].innerHTML = '',
                                elem[i].appendChild(croppedImage);

                                ++i;
                            } //end while

                            _privateObject.cropData = croppedImage;
                            break;
                        } //end if


                        var elm = document.getElementById((`${_privateObject.imagePreview}`).replace('#', ''));

                        elm.innerHTML = '';
                        elm.appendChild(croppedImage);

                        _privateObject.cropData = croppedImage;
                        break;

                        //If blob given
                        case 'blob' :

                        _this.fileReader(croppedImage, (event) => {
                            var img = new Image();
                            img.onload = function() {
                               context.drawImage(img, 100, 100)
                            }

                            var i = 0,
                            elem = document.querySelectorAll(`${_privateObject.imagePreview} img`);

                            //Close the modal on click
                            while(i < elem.length){
                                elem[i].src = event.target.result;

                                ++i;
                            }
                        }); //end file reader

                        _privateObject.cropData = croppedImage;
                        break;
                    } //end switch
                }//end if

                modal.style.display = 'none';

                //set-up the cropped object
                _this.setCropObject(croppedImage);

                return croppedImage;
            }); //end crop result

            $image_crop.destroy();
        }); //end click

        var i = 0,
        closeModal = document.getElementsByClassName('close');

        /**
         * Close the modal on click
         */
        while(i < closeModal.length){
            closeModal[i].addEventListener('click', function(){
                $image_crop.destroy();

                document.getElementById('cropModal').style.display = 'none';
            });

            ++i;
        } //end while
    }; //end constructor
}()); //end function

/**
 * Initialising default object
 * @type Object
 */
var _privateObject = {
    crop            : true,     
    input           : '',   
    cropModal       : '',
    enableExif      : true,
    showZoomer      : true,
    validTypes      : 'jpg|jpeg|png',
    showPreview     : false,
    modalHeader     : 'Crop Image',
    imagePreview    : '',
    modalButtonText : 'Crop',
    boundary : {
        width  : 250,
        height : 250
    },
    viewport : {
        width  : 200,   
        height : 200,
        type   :'square'
    },
    imageResult : {
        type     : 'base64',     //base64, html, blob, rawCanvas (base64)
        size     : 'viewport',   //original, viewport (viewport)
        format   : 'png',        //'jpeg'|'png'|'webp' (png)
        quality  : 1,            //0, 1 (1)
        circle   : null,         //true, false (false)
    },
    getCropModal : function(){
        return `
            <div id="cropModal" class="popup-wrap crop-popup-wrap">
                <div class="crop-container">
                    <!-- Modal content -->
                    <div class="crop-modal-content">
                        <span class="close">&times;</span>
                        <div class="crop-modal-head">
                            <h2 class="text-gradient">${this.modalHeader}</h2>
                        </div>
                        <div class="crop-modal-wrapper">
                            <div id="crop_demo"></div>                                            
                            <div class="crop-btn-wrap">
                                <button type="button" class="ok-btn" id="crop_image">${this.modalButtonText}</button>    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
};

/*Croppie library starts here*/
!function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports&&"string"!=typeof exports.nodeName?module.exports=t():e.Croppie=t()}("undefined"!=typeof self?self:this,function(){"function"!=typeof Promise&&function(e){function n(e,t){return function(){e.apply(t,arguments)}}function r(e){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=null,this._value=null,this._deferreds=[],u(e,n(i,this),n(o,this))}function a(n){var i=this;return null===this._state?void this._deferreds.push(n):void c(function(){var e=i._state?n.onFulfilled:n.onRejected;if(null!==e){var t;try{t=e(i._value)}catch(e){return void n.reject(e)}n.resolve(t)}else(i._state?n.resolve:n.reject)(i._value)})}function i(e){try{if(e===this)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"==typeof e||"function"==typeof e)){var t=e.then;if("function"==typeof t)return void u(n(t,e),n(i,this),n(o,this))}this._state=!0,this._value=e,s.call(this)}catch(e){o.call(this,e)}}function o(e){this._state=!1,this._value=e,s.call(this)}function s(){for(var e=0,t=this._deferreds.length;e<t;e++)a.call(this,this._deferreds[e]);this._deferreds=null}function l(e,t,n,i){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.resolve=n,this.reject=i}function u(e,t,n){var i=!1;try{e(function(e){i||(i=!0,t(e))},function(e){i||(i=!0,n(e))})}catch(e){if(i)return;i=!0,n(e)}}var t=setTimeout,c="function"==typeof setImmediate&&setImmediate||function(e){t(e,1)},h=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)};r.prototype.catch=function(e){return this.then(null,e)},r.prototype.then=function(n,i){var o=this;return new r(function(e,t){a.call(o,new l(n,i,e,t))})},r.all=function(){var s=Array.prototype.slice.call(1===arguments.length&&h(arguments[0])?arguments[0]:arguments);return new r(function(i,o){function r(t,e){try{if(e&&("object"==typeof e||"function"==typeof e)){var n=e.then;if("function"==typeof n)return void n.call(e,function(e){r(t,e)},o)}s[t]=e,0==--a&&i(s)}catch(e){o(e)}}if(0===s.length)return i([]);for(var a=s.length,e=0;e<s.length;e++)r(e,s[e])})},r.resolve=function(t){return t&&"object"==typeof t&&t.constructor===r?t:new r(function(e){e(t)})},r.reject=function(n){return new r(function(e,t){t(n)})},r.race=function(o){return new r(function(e,t){for(var n=0,i=o.length;n<i;n++)o[n].then(e,t)})},r._setImmediateFn=function(e){c=e},"undefined"!=typeof module&&module.exports?module.exports=r:e.Promise||(e.Promise=r)}(this),"function"!=typeof window.CustomEvent&&function(){function e(e,t){t=t||{bubbles:!1,cancelable:!1,detail:void 0};var n=document.createEvent("CustomEvent");return n.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),n}e.prototype=window.Event.prototype,window.CustomEvent=e}(),HTMLCanvasElement.prototype.toBlob||Object.defineProperty(HTMLCanvasElement.prototype,"toBlob",{value:function(e,t,n){for(var i=atob(this.toDataURL(t,n).split(",")[1]),o=i.length,r=new Uint8Array(o),a=0;a<o;a++)r[a]=i.charCodeAt(a);e(new Blob([r],{type:t||"image/png"}))}});var v,g,w,i=["Webkit","Moz","ms"],o=document.createElement("div").style,l=[1,8,3,6],u=[2,7,4,5];function e(e){if(e in o)return e;for(var t=e[0].toUpperCase()+e.slice(1),n=i.length;n--;)if((e=i[n]+t)in o)return e}function p(e,t){for(var n in e=e||{},t)t[n]&&t[n].constructor&&t[n].constructor===Object?(e[n]=e[n]||{},p(e[n],t[n])):e[n]=t[n];return e}function d(e){return p({},e)}function y(e){if("createEvent"in document){var t=document.createEvent("HTMLEvents");t.initEvent("change",!1,!0),e.dispatchEvent(t)}else e.fireEvent("onchange")}function b(e,t,n){if("string"==typeof t){var i=t;(t={})[i]=n}for(var o in t)e.style[o]=t[o]}function x(e,t){e.classList?e.classList.add(t):e.className+=" "+t}function c(e,t){for(var n in t)e.setAttribute(n,t[n])}function C(e){return parseInt(e,10)}function m(e,t){var n=e.naturalWidth,i=e.naturalHeight,o=t||f(e);if(o&&5<=o){var r=n;n=i,i=r}return{width:n,height:i}}g=e("transform"),v=e("transformOrigin"),w=e("userSelect");var t={translate3d:{suffix:", 0px"},translate:{suffix:""}},E=function(e,t,n){this.x=parseFloat(e),this.y=parseFloat(t),this.scale=parseFloat(n)};E.parse=function(e){return e.style?E.parse(e.style[g]):-1<e.indexOf("matrix")||-1<e.indexOf("none")?E.fromMatrix(e):E.fromString(e)},E.fromMatrix=function(e){var t=e.substring(7).split(",");return t.length&&"none"!==e||(t=[1,0,0,1,0,0]),new E(C(t[4]),C(t[5]),parseFloat(t[0]))},E.fromString=function(e){var t=e.split(") "),n=t[0].substring(T.globals.translate.length+1).split(","),i=1<t.length?t[1].substring(6):1,o=1<n.length?n[0]:0,r=1<n.length?n[1]:0;return new E(o,r,i)},E.prototype.toString=function(){var e=t[T.globals.translate].suffix||"";return T.globals.translate+"("+this.x+"px, "+this.y+"px"+e+") scale("+this.scale+")"};var L=function(e){if(!e||!e.style[v])return this.x=0,void(this.y=0);var t=e.style[v].split(" ");this.x=parseFloat(t[0]),this.y=parseFloat(t[1])};function f(e){return e.exifdata&&e.exifdata.Orientation?C(e.exifdata.Orientation):1}function _(e,t,n){var i=t.width,o=t.height,r=e.getContext("2d");switch(e.width=t.width,e.height=t.height,r.save(),n){case 2:r.translate(i,0),r.scale(-1,1);break;case 3:r.translate(i,o),r.rotate(180*Math.PI/180);break;case 4:r.translate(0,o),r.scale(1,-1);break;case 5:e.width=o,e.height=i,r.rotate(90*Math.PI/180),r.scale(1,-1);break;case 6:e.width=o,e.height=i,r.rotate(90*Math.PI/180),r.translate(0,-o);break;case 7:e.width=o,e.height=i,r.rotate(-90*Math.PI/180),r.translate(-i,o),r.scale(1,-1);break;case 8:e.width=o,e.height=i,r.translate(0,i),r.rotate(-90*Math.PI/180)}r.drawImage(t,0,0,i,o),r.restore()}function r(){var e,t,n,i,o,r,a=this,s=a.options.viewport.type?"cr-vp-"+a.options.viewport.type:null;a.options.useCanvas=a.options.enableOrientation||R.call(a),a.data={},a.elements={},e=a.elements.boundary=document.createElement("div"),n=a.elements.viewport=document.createElement("div"),t=a.elements.img=document.createElement("img"),i=a.elements.overlay=document.createElement("div"),a.options.useCanvas?(a.elements.canvas=document.createElement("canvas"),a.elements.preview=a.elements.canvas):a.elements.preview=t,x(e,"cr-boundary"),e.setAttribute("aria-dropeffect","none"),o=a.options.boundary.width,r=a.options.boundary.height,b(e,{width:o+(isNaN(o)?"":"px"),height:r+(isNaN(r)?"":"px")}),x(n,"cr-viewport"),s&&x(n,s),b(n,{width:a.options.viewport.width+"px",height:a.options.viewport.height+"px"}),n.setAttribute("tabindex",0),x(a.elements.preview,"cr-image"),c(a.elements.preview,{alt:"preview","aria-grabbed":"false"}),x(i,"cr-overlay"),a.element.appendChild(e),e.appendChild(a.elements.preview),e.appendChild(n),e.appendChild(i),x(a.element,"croppie-container"),a.options.customClass&&x(a.element,a.options.customClass),function(){var h,p,d,l,m,f=this,n=!1;function v(e,t){var n=f.elements.preview.getBoundingClientRect(),i=m.y+t,o=m.x+e;f.options.enforceBoundary?(l.top>n.top+t&&l.bottom<n.bottom+t&&(m.y=i),l.left>n.left+e&&l.right<n.right+e&&(m.x=o)):(m.y=i,m.x=o)}function i(e){f.elements.preview.setAttribute("aria-grabbed",e),f.elements.boundary.setAttribute("aria-dropeffect",e?"move":"none")}function e(e){if((void 0===e.button||0===e.button)&&(e.preventDefault(),!n)){if(n=!0,h=e.pageX,p=e.pageY,e.touches){var t=e.touches[0];h=t.pageX,p=t.pageY}i(n),m=E.parse(f.elements.preview),window.addEventListener("mousemove",o),window.addEventListener("touchmove",o),window.addEventListener("mouseup",r),window.addEventListener("touchend",r),document.body.style[w]="none",l=f.elements.viewport.getBoundingClientRect()}}function o(e){e.preventDefault();var t=e.pageX,n=e.pageY;if(e.touches){var i=e.touches[0];t=i.pageX,n=i.pageY}var o=t-h,r=n-p,a={};if("touchmove"===e.type&&1<e.touches.length){var s=e.touches[0],l=e.touches[1],u=Math.sqrt((s.pageX-l.pageX)*(s.pageX-l.pageX)+(s.pageY-l.pageY)*(s.pageY-l.pageY));d||(d=u/f._currentZoom);var c=u/d;return B.call(f,c),void y(f.elements.zoomer)}v(o,r),a[g]=m.toString(),b(f.elements.preview,a),z.call(f),p=n,h=t}function r(){i(n=!1),window.removeEventListener("mousemove",o),window.removeEventListener("touchmove",o),window.removeEventListener("mouseup",r),window.removeEventListener("touchend",r),document.body.style[w]="",Z.call(f),F.call(f),d=0}f.elements.overlay.addEventListener("mousedown",e),f.elements.viewport.addEventListener("keydown",function(e){if(!e.shiftKey||38!==e.keyCode&&40!==e.keyCode){if(f.options.enableKeyMovement&&37<=e.keyCode&&e.keyCode<=40){e.preventDefault();var t=s(e.keyCode);m=E.parse(f.elements.preview),document.body.style[w]="none",l=f.elements.viewport.getBoundingClientRect(),o=(i=t)[0],r=i[1],a={},v(o,r),a[g]=m.toString(),b(f.elements.preview,a),z.call(f),document.body.style[w]="",Z.call(f),F.call(f),d=0}}else{var n;n=38===e.keyCode?parseFloat(f.elements.zoomer.value)+parseFloat(f.elements.zoomer.step):parseFloat(f.elements.zoomer.value)-parseFloat(f.elements.zoomer.step),f.setZoom(n)}var i,o,r,a;function s(e){switch(e){case 37:return[1,0];case 38:return[0,1];case 39:return[-1,0];case 40:return[0,-1]}}}),f.elements.overlay.addEventListener("touchstart",e)}.call(this),a.options.enableZoom&&function(){var i=this,e=i.elements.zoomerWrap=document.createElement("div"),t=i.elements.zoomer=document.createElement("input");function o(){(function(e){var t=this,n=e?e.transform:E.parse(t.elements.preview),i=e?e.viewportRect:t.elements.viewport.getBoundingClientRect(),o=e?e.origin:new L(t.elements.preview);function r(){var e={};e[g]=n.toString(),e[v]=o.toString(),b(t.elements.preview,e)}if(t._currentZoom=e?e.value:t._currentZoom,n.scale=t._currentZoom,t.elements.zoomer.setAttribute("aria-valuenow",t._currentZoom),r(),t.options.enforceBoundary){var a=function(e){var t=this._currentZoom,n=e.width,i=e.height,o=this.elements.boundary.clientWidth/2,r=this.elements.boundary.clientHeight/2,a=this.elements.preview.getBoundingClientRect(),s=a.width,l=a.height,u=n/2,c=i/2,h=-1*(u/t-o),p=-1*(c/t-r),d=1/t*u,m=1/t*c;return{translate:{maxX:h,minX:h-(s*(1/t)-n*(1/t)),maxY:p,minY:p-(l*(1/t)-i*(1/t))},origin:{maxX:s*(1/t)-d,minX:d,maxY:l*(1/t)-m,minY:m}}}.call(t,i),s=a.translate,l=a.origin;n.x>=s.maxX&&(o.x=l.minX,n.x=s.maxX),n.x<=s.minX&&(o.x=l.maxX,n.x=s.minX),n.y>=s.maxY&&(o.y=l.minY,n.y=s.maxY),n.y<=s.minY&&(o.y=l.maxY,n.y=s.minY)}r(),I.call(t),F.call(t)}).call(i,{value:parseFloat(t.value),origin:new L(i.elements.preview),viewportRect:i.elements.viewport.getBoundingClientRect(),transform:E.parse(i.elements.preview)})}function n(e){var t,n;if("ctrl"===i.options.mouseWheelZoom&&!0!==e.ctrlKey)return 0;t=e.wheelDelta?e.wheelDelta/1200:e.deltaY?e.deltaY/1060:e.detail?e.detail/-60:0,n=i._currentZoom+t*i._currentZoom,e.preventDefault(),B.call(i,n),o.call(i)}x(e,"cr-slider-wrap"),x(t,"cr-slider"),t.type="range",t.step="0.0001",t.value="1",t.style.display=i.options.showZoomer?"":"none",t.setAttribute("aria-label","zoom"),i.element.appendChild(e),e.appendChild(t),i._currentZoom=1,i.elements.zoomer.addEventListener("input",o),i.elements.zoomer.addEventListener("change",o),i.options.mouseWheelZoom&&(i.elements.boundary.addEventListener("mousewheel",n),i.elements.boundary.addEventListener("DOMMouseScroll",n))}.call(a),a.options.enableResize&&function(){var l,u,c,h,p,e,t,d=this,m=document.createElement("div"),i=!1,f=50;x(m,"cr-resizer"),b(m,{width:this.options.viewport.width+"px",height:this.options.viewport.height+"px"}),this.options.resizeControls.height&&(x(e=document.createElement("div"),"cr-resizer-vertical"),m.appendChild(e));this.options.resizeControls.width&&(x(t=document.createElement("div"),"cr-resizer-horisontal"),m.appendChild(t));function n(e){if((void 0===e.button||0===e.button)&&(e.preventDefault(),!i)){var t=d.elements.overlay.getBoundingClientRect();if(i=!0,u=e.pageX,c=e.pageY,l=-1!==e.currentTarget.className.indexOf("vertical")?"v":"h",h=t.width,p=t.height,e.touches){var n=e.touches[0];u=n.pageX,c=n.pageY}window.addEventListener("mousemove",o),window.addEventListener("touchmove",o),window.addEventListener("mouseup",r),window.addEventListener("touchend",r),document.body.style[w]="none"}}function o(e){var t=e.pageX,n=e.pageY;if(e.preventDefault(),e.touches){var i=e.touches[0];t=i.pageX,n=i.pageY}var o=t-u,r=n-c,a=d.options.viewport.height+r,s=d.options.viewport.width+o;"v"===l&&f<=a&&a<=p?(b(m,{height:a+"px"}),d.options.boundary.height+=r,b(d.elements.boundary,{height:d.options.boundary.height+"px"}),d.options.viewport.height+=r,b(d.elements.viewport,{height:d.options.viewport.height+"px"})):"h"===l&&f<=s&&s<=h&&(b(m,{width:s+"px"}),d.options.boundary.width+=o,b(d.elements.boundary,{width:d.options.boundary.width+"px"}),d.options.viewport.width+=o,b(d.elements.viewport,{width:d.options.viewport.width+"px"})),z.call(d),W.call(d),Z.call(d),F.call(d),c=n,u=t}function r(){i=!1,window.removeEventListener("mousemove",o),window.removeEventListener("touchmove",o),window.removeEventListener("mouseup",r),window.removeEventListener("touchend",r),document.body.style[w]=""}e&&(e.addEventListener("mousedown",n),e.addEventListener("touchstart",n));t&&(t.addEventListener("mousedown",n),t.addEventListener("touchstart",n));this.elements.boundary.appendChild(m)}.call(a)}function R(){return this.options.enableExif&&window.EXIF}function B(e){if(this.options.enableZoom){var t=this.elements.zoomer,n=A(e,4);t.value=Math.max(parseFloat(t.min),Math.min(parseFloat(t.max),n)).toString()}}function Z(e){var t=this,n=t._currentZoom,i=t.elements.preview.getBoundingClientRect(),o=t.elements.viewport.getBoundingClientRect(),r=E.parse(t.elements.preview.style[g]),a=new L(t.elements.preview),s=o.top-i.top+o.height/2,l=o.left-i.left+o.width/2,u={},c={};if(e){var h=a.x,p=a.y,d=r.x,m=r.y;u.y=h,u.x=p,r.y=d,r.x=m}else u.y=s/n,u.x=l/n,c.y=(u.y-a.y)*(1-n),c.x=(u.x-a.x)*(1-n),r.x-=c.x,r.y-=c.y;var f={};f[v]=u.x+"px "+u.y+"px",f[g]=r.toString(),b(t.elements.preview,f)}function z(){if(this.elements){var e=this.elements.boundary.getBoundingClientRect(),t=this.elements.preview.getBoundingClientRect();b(this.elements.overlay,{width:t.width+"px",height:t.height+"px",top:t.top-e.top+"px",left:t.left-e.left+"px"})}}L.prototype.toString=function(){return this.x+"px "+this.y+"px"};var a,s,h,M,I=(a=z,s=500,function(){var e=this,t=arguments,n=h&&!M;clearTimeout(M),M=setTimeout(function(){M=null,h||a.apply(e,t)},s),n&&a.apply(e,t)});function F(){var e,t=this,n=t.get();X.call(t)&&(t.options.update.call(t,n),t.$&&"undefined"==typeof Prototype?t.$(t.element).trigger("update.croppie",n):(window.CustomEvent?e=new CustomEvent("update",{detail:n}):(e=document.createEvent("CustomEvent")).initCustomEvent("update",!0,!0,n),t.element.dispatchEvent(e)))}function X(){return 0<this.elements.preview.offsetHeight&&0<this.elements.preview.offsetWidth}function Y(){var e,t=this,n={},i=t.elements.preview,o=new E(0,0,1),r=new L;X.call(t)&&!t.data.bound&&(t.data.bound=!0,n[g]=o.toString(),n[v]=r.toString(),n.opacity=1,b(i,n),e=t.elements.preview.getBoundingClientRect(),t._originalImageWidth=e.width,t._originalImageHeight=e.height,t.data.orientation=f(t.elements.img),t.options.enableZoom?W.call(t,!0):t._currentZoom=1,o.scale=t._currentZoom,n[g]=o.toString(),b(i,n),t.data.points.length?function(e){if(4!==e.length)throw"Croppie - Invalid number of points supplied: "+e;var t=this,n=e[2]-e[0],i=t.elements.viewport.getBoundingClientRect(),o=t.elements.boundary.getBoundingClientRect(),r={left:i.left-o.left,top:i.top-o.top},a=i.width/n,s=e[1],l=e[0],u=-1*e[1]+r.top,c=-1*e[0]+r.left,h={};h[v]=l+"px "+s+"px",h[g]=new E(c,u,a).toString(),b(t.elements.preview,h),B.call(t,a),t._currentZoom=a}.call(t,t.data.points):function(){var e=this,t=e.elements.preview.getBoundingClientRect(),n=e.elements.viewport.getBoundingClientRect(),i=e.elements.boundary.getBoundingClientRect(),o=n.left-i.left,r=n.top-i.top,a=o-(t.width-n.width)/2,s=r-(t.height-n.height)/2,l=new E(a,s,e._currentZoom);b(e.elements.preview,g,l.toString())}.call(t),Z.call(t),z.call(t))}function W(e){var t,n,i,o,r=this,a=Math.max(r.options.minZoom,0)||0,s=r.options.maxZoom||1.5,l=r.elements.zoomer,u=parseFloat(l.value),c=r.elements.boundary.getBoundingClientRect(),h=m(r.elements.img,r.data.orientation),p=r.elements.viewport.getBoundingClientRect();r.options.enforceBoundary&&(i=p.width/h.width,o=p.height/h.height,a=Math.max(i,o)),s<=a&&(s=a+1),l.min=A(a,4),l.max=A(s,4),!e&&(u<l.min||u>l.max)?B.call(r,u<l.min?l.min:l.max):e&&(n=Math.max(c.width/h.width,c.height/h.height),t=null!==r.data.boundZoom?r.data.boundZoom:n,B.call(r,t)),y(l)}function O(e){var t=e.points,n=C(t[0]),i=C(t[1]),o=C(t[2])-n,r=C(t[3])-i,a=e.circle,s=document.createElement("canvas"),l=s.getContext("2d"),u=e.outputWidth||o,c=e.outputHeight||r;s.width=u,s.height=c,e.backgroundColor&&(l.fillStyle=e.backgroundColor,l.fillRect(0,0,u,c));var h=n,p=i,d=o,m=r,f=0,v=0,g=u,w=c;return n<0&&(h=0,f=Math.abs(n)/o*u),d+h>this._originalImageWidth&&(g=(d=this._originalImageWidth-h)/o*u),i<0&&(p=0,v=Math.abs(i)/r*c),m+p>this._originalImageHeight&&(w=(m=this._originalImageHeight-p)/r*c),l.drawImage(this.elements.preview,h,p,d,m,f,v,g,w),a&&(l.fillStyle="#fff",l.globalCompositeOperation="destination-in",l.beginPath(),l.arc(s.width/2,s.height/2,s.width/2,0,2*Math.PI,!0),l.closePath(),l.fill()),s}function k(c,h){var e,i,o,r,p=this,d=[],t=null,n=R.call(p);if("string"==typeof c)e=c,c={};else if(Array.isArray(c))d=c.slice();else{if(void 0===c&&p.data.url)return Y.call(p),F.call(p),null;e=c.url,d=c.points||[],t=void 0===c.zoom?null:c.zoom}return p.data.bound=!1,p.data.url=e||p.data.url,p.data.boundZoom=t,(i=e,o=n,r=new Image,r.style.opacity="0",new Promise(function(e,t){function n(){r.style.opacity="1",setTimeout(function(){e(r)},1)}r.removeAttribute("crossOrigin"),i.match(/^https?:\/\/|^\/\//)&&r.setAttribute("crossOrigin","anonymous"),r.onload=function(){o?EXIF.getData(r,function(){n()}):n()},r.onerror=function(e){r.style.opacity=1,setTimeout(function(){t(e)},1)},r.src=i})).then(function(e){if(function(t){this.elements.img.parentNode&&(Array.prototype.forEach.call(this.elements.img.classList,function(e){t.classList.add(e)}),this.elements.img.parentNode.replaceChild(t,this.elements.img),this.elements.preview=t),this.elements.img=t}.call(p,e),d.length)p.options.relative&&(d=[d[0]*e.naturalWidth/100,d[1]*e.naturalHeight/100,d[2]*e.naturalWidth/100,d[3]*e.naturalHeight/100]);else{var t,n,i=m(e),o=p.elements.viewport.getBoundingClientRect(),r=o.width/o.height;r<i.width/i.height?t=(n=i.height)*r:(t=i.width,n=i.height/r);var a=(i.width-t)/2,s=(i.height-n)/2,l=a+t,u=s+n;p.data.points=[a,s,l,u]}p.data.points=d.map(function(e){return parseFloat(e)}),p.options.useCanvas&&function(e){var t=this.elements.canvas,n=this.elements.img;t.getContext("2d").clearRect(0,0,t.width,t.height),t.width=n.width,t.height=n.height,_(t,n,this.options.enableOrientation&&e||f(n))}.call(p,c.orientation),Y.call(p),F.call(p),h&&h()})}function A(e,t){return parseFloat(e).toFixed(t||0)}function j(){var e=this,t=e.elements.preview.getBoundingClientRect(),n=e.elements.viewport.getBoundingClientRect(),i=n.left-t.left,o=n.top-t.top,r=(n.width-e.elements.viewport.offsetWidth)/2,a=(n.height-e.elements.viewport.offsetHeight)/2,s=i+e.elements.viewport.offsetWidth+r,l=o+e.elements.viewport.offsetHeight+a,u=e._currentZoom;(u===1/0||isNaN(u))&&(u=1);var c=e.options.enforceBoundary?0:Number.NEGATIVE_INFINITY;return i=Math.max(c,i/u),o=Math.max(c,o/u),s=Math.max(c,s/u),l=Math.max(c,l/u),{points:[A(i),A(o),A(s),A(l)],zoom:u,orientation:e.data.orientation}}var H={type:"canvas",format:"png",quality:1},N=["jpeg","webp","png"];function n(e){var t=this,n=j.call(t),i=p(d(H),d(e)),o="string"==typeof e?e:i.type||"base64",r=i.size||"viewport",a=i.format,s=i.quality,l=i.backgroundColor,u="boolean"==typeof i.circle?i.circle:"circle"===t.options.viewport.type,c=t.elements.viewport.getBoundingClientRect(),h=c.width/c.height;return"viewport"===r?(n.outputWidth=c.width,n.outputHeight=c.height):"object"==typeof r&&(r.width&&r.height?(n.outputWidth=r.width,n.outputHeight=r.height):r.width?(n.outputWidth=r.width,n.outputHeight=r.width/h):r.height&&(n.outputWidth=r.height*h,n.outputHeight=r.height)),-1<N.indexOf(a)&&(n.format="image/"+a,n.quality=s),n.circle=u,n.url=t.data.url,n.backgroundColor=l,new Promise(function(e){switch(o.toLowerCase()){case"rawcanvas":e(O.call(t,n));break;case"canvas":case"base64":e(function(e){return O.call(this,e).toDataURL(e.format,e.quality)}.call(t,n));break;case"blob":(function(e){var n=this;return new Promise(function(t){O.call(n,e).toBlob(function(e){t(e)},e.format,e.quality)})}).call(t,n).then(e);break;default:e(function(e){var t=e.points,n=document.createElement("div"),i=document.createElement("img"),o=t[2]-t[0],r=t[3]-t[1];return x(n,"croppie-result"),n.appendChild(i),b(i,{left:-1*t[0]+"px",top:-1*t[1]+"px"}),i.src=e.url,b(n,{width:o+"px",height:r+"px"}),n}.call(t,n))}})}function S(e){if(!this.options.useCanvas||!this.options.enableOrientation)throw"Croppie: Cannot rotate without enableOrientation && EXIF.js included";var t,n,i,o,r,a=this,s=a.elements.canvas;a.data.orientation=(t=a.data.orientation,n=e,i=-1<l.indexOf(t)?l:u,o=i.indexOf(t),r=n/90%i.length,i[(i.length+o+r%i.length)%i.length]),_(s,a.elements.img,a.data.orientation),Z.call(a,!0),W.call(a)}if(window.jQuery){var P=window.jQuery;P.fn.croppie=function(n){if("string"!==typeof n)return this.each(function(){var e=new T(this,n);(e.$=P)(this).data("croppie",e)});var i=Array.prototype.slice.call(arguments,1),e=P(this).data("croppie");return"get"===n?e.get():"result"===n?e.result.apply(e,i):"bind"===n?e.bind.apply(e,i):this.each(function(){var e=P(this).data("croppie");if(e){var t=e[n];if(!P.isFunction(t))throw"Croppie "+n+" method not found";t.apply(e,i),"destroy"===n&&P(this).removeData("croppie")}})}}function T(e,t){if(-1<e.className.indexOf("croppie-container"))throw new Error("Croppie: Can't initialize croppie more than once");if(this.element=e,this.options=p(d(T.defaults),t),"img"===this.element.tagName.toLowerCase()){var n=this.element;x(n,"cr-original-image"),c(n,{"aria-hidden":"true",alt:""});var i=document.createElement("div");this.element.parentNode.appendChild(i),i.appendChild(n),this.element=i,this.options.url=this.options.url||n.src}if(r.call(this),this.options.url){var o={url:this.options.url,points:this.options.points};delete this.options.url,delete this.options.points,k.call(this,o)}}return T.defaults={viewport:{width:100,height:100,type:"square"},boundary:{},orientationControls:{enabled:!0,leftClass:"",rightClass:""},resizeControls:{width:!0,height:!0},customClass:"",showZoomer:!0,enableZoom:!0,enableResize:!1,mouseWheelZoom:!0,enableExif:!1,enforceBoundary:!0,enableOrientation:!1,enableKeyMovement:!0,update:function(){}},T.globals={translate:"translate3d"},p(T.prototype,{bind:function(e,t){return k.call(this,e,t)},get:function(){var e=j.call(this),t=e.points;return this.options.relative&&(t[0]/=this.elements.img.naturalWidth/100,t[1]/=this.elements.img.naturalHeight/100,t[2]/=this.elements.img.naturalWidth/100,t[3]/=this.elements.img.naturalHeight/100),e},result:function(e){return n.call(this,e)},refresh:function(){return function(){Y.call(this)}.call(this)},setZoom:function(e){B.call(this,e),y(this.elements.zoomer)},rotate:function(e){S.call(this,e)},destroy:function(){return function(){var e,t,n=this;n.element.removeChild(n.elements.boundary),e=n.element,t="croppie-container",e.classList?e.classList.remove(t):e.className=e.className.replace(t,""),n.options.enableZoom&&n.element.removeChild(n.elements.zoomerWrap),delete n.elements}.call(this)}}),T});
/*Croppie library ends here*/