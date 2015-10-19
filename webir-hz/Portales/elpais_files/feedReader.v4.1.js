var a, FeedReader = function(){
    this.params_ = {
        numEntries: "",
        rssUrl: "",
        divID: "",
        width: "",
        height: "",
        logoUrl: "",
        scrollable: false,
        showTitle: true,
        showLogo: true,
        showImages: true,
        showTitles: true,
        showDescriptions: true,
        showDomains: true,
        showDomainWWW: false,
        cropping: true,
        enableDescriptionsLink: true,
        showExtraImages: false,
		tagXmlForImage: "thumbnail",
        structure: ["title", "image", "description", "extra", "domain"]
    };
    this.images_ = []
};
a = FeedReader.prototype;
a.mergeParams = function(b){
    for (var c in b) 
        this.params_[c] = b[c]
};
a.show = function(b){
    var c = this;
    this.mergeParams(b);
    google.load("feeds", "1");
    google.setOnLoadCallback(function(){
        //Developer version
        //var d = new google.feeds.Feed(c.params_.rssUrl+ '?cache-busting=' + new Date().getTime());
        //Production version
        var d = new google.feeds.Feed(c.params_.rssUrl);
        d.setResultFormat(google.feeds.Feed.MIXED_FORMAT);
        //d.setNumEntries(c.params_.numEntries);
        d.setNumEntries(30);
        d.load(function(e){
            c.render_(e)
        })
    })
};
a.render_ = function(b){
    if (this.setContainer_(this.params_.divID)) 
        if (b.error || !b.feed || !b.feed.entries || !b.xmlDocument) 
            this.params_.containerDiv.innerHTML = "No se encontraron elementos.";
        else {
            this.createChannelTitle_(b);
            //this.createSearchButtom_(b);
            this.createFeedsDiv_(this.params_.containerDiv);
            for (var c = this.randomize_(b.feed.entries), d = 0; d < c.length; d++) {
                var e = c[d], g = this.createDiv_(this.params_.feeds, "item-box");
				var g2 = this.createDiv_(g, "item--inner")
                for (var f in this.params_.structure) {

					

                    switch (this.params_.structure[f]) {
                        case "title":
                            this.createEntryTitle_(g2, e, d);
                            break;
                        case "image":
                            this.createEntryImage_(g, e, d);
                            break;
                        case "description":
                            this.createEntryDescription_(g2, e, d);
                            break;
                        case "extra":
                            this.createExtraImagesDiv_(g2, e, d);
                            break;
                        case "domain":
                            this.createEntryDomain_(g2, b.feed.link, d);
                            break
						case "price":
							this.createEntryPrice_(g2, e, d);
                            break
                    }
				}
            }
            this.removeOverflow_();
            this.spaceFeeds_()
        }
};
a.setContainer_ = function(b){
    if (!b) 
        return false;
    var c = document.getElementById(b);
    if (!c) {
        document.write("No se encontr\u00f3 la capa contenedora: " + b);
        return false
    }
    for (this.resize_(c, this.params_.width, this.params_.height); c.firstChild;) 
        c.removeChild(c.firstChild);
    this.params_.containerDiv = c;
    return true
};
a.createFeedsDiv_ = function(b){
    b = this.createDiv_(b, "fdrd-feeds");
    b.style.overflowX = "hidden";
    b.style.overflowY = this.params_.scrollable ? "auto" : "hidden";
    this.params_.feeds = b;
    this.adjustFeeds_()
};
a.randomize_ = function(b){
    b.sort(randomOrder);
    return b
};
a.createChannelTitle_ = function(b){
    if (this.params_.showTitle) {
		var c  =this.params_.containerDiv;
        /*var c = this.createDiv_(this.params_.containerDiv, "fdrd-channelTitleDiv"),*/ d = this.createLink_(c, "fdrd-channelTitle", b.feed.link, "");
        if (this.params_.logoUrl == null) 
            this.params_.logoUrl = this.findLogo_(b);
        if (this.params_.logoUrl != null && this.params_.showLogo) {
            var e = this;
            d.appendChild(this.createImage_(this.params_.logoUrl, "fdrd-channelLogo", b.feed.title, b.feed.title, function(){
                e.adjustImageSize_(this, e.params_.width);
                e.adjustFeeds_();
                e.removeOverflow_();
                e.spaceFeeds_()
            }))
        }
        else 
            this.createElement_("span", d, "fdrd-channelTitleSpan", b.feed.title);
        this.params_.header = d
    }
};

a.createSearchButtom_ = function (b){
    var c = document.getElementById("fdrd-eqbe2");
    var f = document.createElement("form");
    f.action = "http://www.ulala.com.uy/s/";
    f.id = "searchform";
    f.target = "_blank";
    c.appendChild(f);
    
    var h = document.createElement("input");
    h.type ="hidden";
    h.name = "CMD";
    h.value= "SEARCH";
    f.appendChild(h);

    var s = document.createElement("input");
    s.type = "text";
    s.name = "SearchFor";
    //a.setAttribute = "required";
    s.setAttribute('required', true);
    //s.attr = "required";
    s.placeholder ="Buscar aquí...";

    f.appendChild(s);

    var send = document.createElement("button");
    send.setAttribute('type', 'submit');
    var newspan = document.createElement("span");
    newspan.innerHTML ="Buscar"; 
    send.appendChild(newspan);    
    f.appendChild(send);
}
a.createEntryImage_ = function(b, c, d){
    if (this.params_.showImages) {
        this.images_[d] = google.feeds.getElementsByTagNameNS(c.xmlNode, "http://search.yahoo.com/mrss/", this.params_.tagXmlForImage);
        d = this.images_[d][0];
        if (d != null) {
            d = d.getAttribute("url");
            if (d != null) {

				b = this.createLink_(b, "", c.link, "")
				var e = this;

                this.createDiv_(b, "item--img").appendChild(this.createImage_(d, "img-responsive mma", c.title, c.title, function(){
                    e.adjustImageSize_(this, e.params_.width);
                    e.removeOverflow_();
                    e.spaceFeeds_()
                }));

				/*
                b = this.createDiv_(b, "fdrd-entryImageDiv");
                var e = this;
                this.createLink_(b, "fdrd-entryImageLink", c.link, "").appendChild(this.createImage_(d, "fdrd-entryImage", c.title, c.title, function(){
                    e.adjustImageSize_(this, e.params_.width);
                    e.removeOverflow_();
                    e.spaceFeeds_()
                }));
				*/
                return b
            }
        }
    }
};
a.createExtraImagesDiv_ = function(b, c, d){
    if (this.images_[d] && this.images_[d].length > 1 && this.params_.scrollable && this.params_.showExtraImages) {
        var e = this.createDiv_(b, "fdrd-entryExtraImagesDiv"), g = this.createLink_(this.createDiv_(e, "fdrd-entryLinkDiv"), "fdrd-entryLink", "#showExtraImages", "( + im\u00e1genes )");
        g.setAttribute("target", "_self");
        g.setAttribute("title", "Clic para ver m\u00e1s imagenes de la nota");
        var f = "fdrd-entryExtraImagesDiv_" + d, h = this.createDiv_(e, "fdrd-entryHiddenDiv");
        h.id = f;
        toggleVisibility(f);
        for (e = 1; e < this.images_[d].length; e++) {
            var i = this.images_[d][e].getAttribute("url");
            if (i != null) {
                var j = this;
                this.createLink_(this.createDiv_(h, "fdrd-entryImageDiv"), "fdrd-entryImageLink", c.link, "").appendChild(this.createImage_(i, "fdrd-entryImage", c.title, c.title, function(){
                    j.adjustImageSize_(h, j.params_.width)
                }))
            }
        }
        g.onclick = function(){
            toggleVisibility(f)
        }
    }
    return b
};
a.createEntryTitle_ = function(b, c){

	if (this.params_.showTitles)
	{
		var b = this.createElementHTML_("h3",b,"","");

		this.createLink_(b, "", c.link, c.title)

	}	
};

a.createEntryPrice_ = function(b,c)
{
var _currency = "$U ";
var _discount = 0;
var _price = 0;
var _oldPrice = 0;
/*
<div class="item--price-anterior">
	<span class="item--price-currency">$U</span> 3.500,00
	
</div><!--Item price ant-->
<!--Item price-->
<div class="item--price">
	<span class="item--price-currency">$U</span> 1.500,00
	
</div>

 <div data-original-title="Antes $U 2.000,00" data-toggle="tooltip" data-placement="top" class="item--price-offer tooltip-js">-25%</div>
*/	
	var el = c.xmlNode.getElementsByTagName("currency")[0];
	_currency = el.text || el.innerHTML || el.textContent;


	//_currency = c.xmlNode.childNodes[2].innerHTML+ " ";

	el = c.xmlNode.getElementsByTagName("discountRate")[0];
	_discount = el.text || el.innerHTML || el.textContent;

	//if(c.xmlNode.childNodes.length>5 && c.xmlNode.childNodes[5].innerHTML && (-parseFloat(c.xmlNode.childNodes[5].innerHTML))>0)
	if(typeof(_discount)=="undefined" && _discount=="")
	{
		_discount = 0;
	}

	el = c.xmlNode.getElementsByTagName("actualPrice")[0];
	var el1 = c.xmlNode.getElementsByTagName("originalPrice")[0];
	

	if(-_discount>0)
	{
		_price = el.text || el.innerHTML || el.textContent;
		_oldPrice = el1.text || el1.innerHTML || el.textContent;
		//_oldPrice = c.xmlNode.childNodes[4].innerHTML;
		//_price = c.xmlNode.childNodes[3].innerHTML;

	}else{
		//_price = c.xmlNode.childNodes[3].innerHTML;
		_price = el.text || el.innerHTML || el.textContent;

	}

	if(Math.round(_price)== (_price)){
		_price = Math.round(_price);
	}
	if(Math.round(_oldPrice)== (_oldPrice)){
		_oldPrice = Math.round(_oldPrice);
	}


	if(-_discount>0){
		var b1 = this.createDiv_(b, "item--price-anterior");
		this.createElementHTML_("span",b1,"item--price-currency",_currency).appendChild(document.createTextNode(_oldPrice));


		this.createDiv_(b.parentNode, "item--price-offer tooltip-js").innerHTML= _discount +"%";
		//if(b.parentNode.className=="fdrd-feeds"){
			
		//}else{
		//	var b2 = this.createDiv_(b, "item--price");
		//}
		//this.createElementHTML_("span",b2,"item--price-currency",_currency).appendChild(document.createTextNode(_price));

	}else{
		var b1 = this.createDiv_(b, "item--price-anterior item--price-anterior-empty");
		this.createElementHTML_("span",b1,"item--price-currency", "&nbsp;").appendChild(document.createTextNode(" "));
	}

	var b3 = this.createDiv_(b, "item--price");
	this.createElementHTML_("span",b3,"item--price-currency",_currency).appendChild(document.createTextNode(_price));
	
	

	



	

}

a.createEntryDescription_ = function(b, c){
    if (this.params_.showDescriptions) {
        b = this.createDiv_(b, "fdrd-entryBodyDiv");
        if (c.content) 
            if (this.params_.enableDescriptionsLink) 
                this.createLink_(b, "fdrd-entryBodyLink", c.link).innerHTML = c.content;
            else 
                b.innerHTML = c.content
    }
};
a.createEntryDomain_ = function(b, c){
    this.params_.showDomains && this.createLink_(this.createDiv_(b, "fdrd-entryDomainDiv"), "fdrd-entryDomainLink", c, this.getDomain_(c, this.params_.showDomainWWW))
};
a.adjustable_ = function(){
    return this.params_.scrollable || !this.params_.cropping || this.params_.feeds == null || this.params_.feeds.childNodes == null
};
a.removeOverflow_ = function(){
    var b = 0, c = 0;
    if (this.params_.numEntries && this.params_.feeds) 
        for (c = this.params_.numEntries; this.params_.feeds.childNodes.length > c;) {
            e = this.params_.feeds.childNodes[c];
            this.params_.feeds.removeChild(e)
        }
    if (!this.adjustable_()) {
        var d, e;
        c = 0;
        this.params_.contentHeight = 0;
        for (b += this.getElemSpacing_(this.params_.feeds); c < this.params_.feeds.childNodes.length;) {
            e = this.params_.feeds.childNodes[c];
            d = e.offsetHeight - this.getElemSpacing_(e);
            if (b > this.params_.maxFeedsHeight) {
                b -= d;
                this.params_.feeds.removeChild(e);
                this.removeOverflow_();
                e = null
            }
            else {
                b += d;
                c++
            }
        }
        if (b > this.params_.maxFeedsHeight && e != null) {
            b -= d;
            this.params_.feeds.removeChild(e)
        }
    }
    this.params_.contentHeight = b
};
a.calculateFeedsSpacing_ = function(){
    return parseInt((this.params_.maxFeedsHeight - this.params_.contentHeight) / this.params_.feeds.childNodes.length / 2)
};
a.spaceFeeds_ = function(){
    if (!this.adjustable_()) {
        var b = this.params_.feeds.childNodes;
        if (b.length > 0) {
            var c = this.calculateFeedsSpacing_();
            if (c < 5) {
                this.params_.feeds.removeChild(b[b.length - 1]);
                this.recalculateHeight_();
                c = this.calculateFeedsSpacing_()
            }
            isIE() || (c += "px");
            for (var d in b) {
                entry = b[d];
                if (typeof entry == "object") {
                    var e = this.params_.feeds.childNodes[d];
                    e.style.paddingTop = c;
                    e.style.paddingBottom = c
                }
            }
        }
    }
};
a.recalculateHeight_ = function(){
    if (this.params_.feeds != null && this.params_.feeds.childNodes != null) {
        var b = 0, c = 0, d;
        this.params_.contentHeight = 0;
        for (b += this.getElemSpacing_(this.params_.feeds); c < this.params_.feeds.childNodes.length;) {
            d = this.params_.feeds.childNodes[c];
            d = d.offsetHeight - this.getElemSpacing_(d);
            b += d;
            c++
        }
        this.params_.contentHeight = b
    }
};
a.adjustImageSize_ = function(b, c){
    c = c - 10;
    if (b.width > c) {
        b.height = b.height * c / b.width;
        b.width = c
    }
    return b
};
a.adjustFeeds_ = function(){
    var b = 0;
    if (this.params_.header) 
        if (this.getCurrentStyle_(this.params_.header, "position") != "relative") 
            b = this.params_.header.offsetHeight + this.getElemSpacing_(this.params_.header);
    this.params_.maxFeedsHeight = this.params_.height - b - 10;
    if (this.params_.feeds) 
        this.params_.feeds.style.height = this.params_.maxFeedsHeight + "px"
};
a.createImage_ = function(b, c, d, e, g){
    var f = document.createElement("img");
    f.className = c;
    f.onload = g;
    f.setAttribute("src", b);
    f.setAttribute("alt", d);
    f.setAttribute("title", e);
    return f
};
a.createLink_ = function(b, c, d, e){
    b = this.createElement_("a", b, c, e);
    b.href = d;
    b.setAttribute("target", "_blank");
    return b
};
a.createDivHTML_ = function(b, c, d){
    return this.createElementHTML_("div", b, c, d)
};
a.createElementHTML_ = function(b, c, d, e){
    b = document.createElement(b);
    b.className = d;
    b.innerHTML = e;
    c.appendChild(b);
    return b
};
a.createDiv_ = function(b, c, d){
    return this.createElement_("div", b, c, d)
};
a.createElement_ = function(b, c, d, e){
    b = document.createElement(b);
    b.className = d;
    c != null && c.appendChild(b);
    e && b.appendChild(document.createTextNode(e));
    return b
};
a.findLogo_ = function(b){
    var c, d = b.xmlDocument.getElementsByTagName("image")[0];
    d = d != null ? d.getElementsByTagName("url")[0] : b.xmlDocument.getElementsByTagName("logo")[0];
    if (d != null) 
        c = d.firstChild.nodeValue;
    return c
};
a.getCurrentStyle_ = function(b, c){
    if (b) 
        if (b.currentStyle) {
            c = c.match(/\w[^-]*/g);
            for (var d = c[0], e = 1; e < c.length; ++e) 
                d += c[e].replace(/\w/, c[e].charAt(0).toUpperCase());
            return b.currentStyle[d]
        }
        else 
            if (document.defaultView.getComputedStyle) 
                return document.defaultView.getComputedStyle(b, null).getPropertyValue(c)
};
a.getElemStyleVal_ = function(b, c){
    b = parseInt(this.getCurrentStyle_(b, c).split("px")[0]);
    return b > 0 ? b : 0
};
a.getElemSpacing_ = function(b){
    return this.getElemStyleVal_(b, "margin-top") + this.getElemStyleVal_(b, "margin-bottom") + this.getElemStyleVal_(b, "padding-top") + this.getElemStyleVal_(b, "padding-bottom") + 0
};
a.resize_ = function(b, c, d){
    b.style.width = c + "px";
    b.style.height = d + "px"
};
a.getDomain_ = function(b, c){
    b = b.replace("http://", "");
    c || (b = b.replace("www.", ""));
    return b.split("/")[0]
};
var randomOrder = function(){
    return Math.round(Math.random()) - 0.5
}, createCSS = function(b){
    var c = document.createElement("link");
    c.type = "text/css";
    c.rel = "stylesheet";
    c.media = "screen";
    c.href = b;
    return c
}, includeCSS = function(b){
    document.getElementsByTagName("head")[0].appendChild(createCSS(b))
}, isIE = function(){
    return /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)
}, toggleVisibility = function(b){
    b = document.getElementById(b);
    if (b != null) {
        var c = b.style.display;
        b.style.display = typeof c == "undefined" ||
        c == "none" ? "table" : "none"
    }
};
for (param in rssParam) 
    (new FeedReader).show(rssParam[param]);
if (typeof css === "undefined") 
    var css = "rssStyle.css";
includeCSS(css);

