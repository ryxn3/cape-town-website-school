// ---------- pictures from wikipedia ----------
// the pictures come from the wikipedia page of each place,
// that way they always work and i don't have to download them

let wikiApi = "https://en.wikipedia.org/api/rest_v1/page/";
let saved = {}; // so we don't ask wikipedia for the same thing twice

function getWiki(what, title) {
    let url = wikiApi + what + "/" + encodeURIComponent(title);
    if (!saved[url]) {
        saved[url] = fetch(url).then(function (res) {
            if (!res.ok) throw new Error("wikipedia said no");
            return res.json();
        });
    }
    return saved[url];
}

// gets the main picture of a place in the size i want
function getPhoto(place, width) {
    return getWiki("summary", place.wiki).then(function (page) {
        if (page.originalimage && page.originalimage.width <= width) {
            return page.originalimage.source;
        }
        if (page.thumbnail) {
            // the link has the size in it like /320px-, so i change the number
            return page.thumbnail.source.replace(/\/\d+px-/, "/" + width + "px-");
        }
        return null;
    });
}

// gets the other pictures on the wikipedia page
function getGallery(place) {
    return getWiki("media-list", place.wiki).then(function (data) {
        let pics = [];
        data.items.forEach(function (item) {
            if (item.type != "image" || !item.srcset || !item.showInGallery) return;
            // skip maps, logos, flags and drawings
            if (/\.svg|map|logo|flag|locator|coat_of_arms|icon/i.test(item.title)) return;
            pics.push({
                small: "https:" + item.srcset[0].src,
                big: "https:" + item.srcset[item.srcset.length - 1].src,
                caption: item.caption ? item.caption.text : ""
            });
        });
        return pics.slice(0, 8);
    });
}

// put a picture in an <img> and hide it if it doesn't load
function showPhoto(img, src) {
    img.classList.remove("broken");
    img.onerror = function () { img.classList.add("broken"); };
    if (src) {
        img.src = src;
    } else {
        img.removeAttribute("src");
        img.classList.add("broken");
    }
}

// the big picture at the top of the page
getPhoto(places[0], 1920).then(function (src) {
    if (src) document.getElementById("hero").style.backgroundImage = "url('" + src + "')";
}).catch(function () {});


// ---------- the globe ----------

let capeTown = { lat: -34.08, lng: 18.43, altitude: 0.015 };
let space = { lat: -15, lng: 20, altitude: 2.6 };
let globe = null;

function makePin(place, number) {
    let pin = document.createElement("div");
    pin.className = "pin";
    pin.style.background = types[place.type].colour;
    pin.textContent = number;
    return pin;
}

// the list next to the globe
let list = document.getElementById("place-list");

places.forEach(function (place, i) {
    let btn = document.createElement("button");
    btn.appendChild(makePin(place, i + 1));
    btn.appendChild(document.createTextNode(place.name));
    btn.addEventListener("click", function () { openPlace(place.id); });
    let li = document.createElement("li");
    li.appendChild(btn);
    list.appendChild(li);
});

let globeBox = document.getElementById("globe");

// if globe.gl didn't load (no internet) the list still works
if (window.Globe) {
    globeBox.innerHTML = "";

    globe = new Globe(globeBox)
        .width(globeBox.clientWidth)
        .height(globeBox.clientHeight)
        .backgroundColor("#0b1a26")
        .atmosphereColor("#9fd3ff")
        // satellite pictures from esri, they load in more detail when you zoom in
        .globeTileEngineUrl(function (x, y, level) {
            return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/" + level + "/" + y + "/" + x;
        })
        .htmlElementsData(places)
        .htmlElement(function (place) {
            let i = places.indexOf(place);
            let pin = makePin(place, i + 1);
            let name = document.createElement("span");
            name.textContent = place.name;
            pin.appendChild(name);
            pin.addEventListener("click", function () { openPlace(place.id); });
            return pin;
        })
        // hide the pins when they go round the back of the globe
        .htmlElementVisibilityModifier(function (pin, visible) {
            pin.style.display = visible ? "" : "none";
        });

    // start in space and then fly down to cape town
    globe.pointOfView(space);
    setTimeout(function () { globe.pointOfView(capeTown, 4000); }, 800);

    window.addEventListener("resize", function () {
        globe.width(globeBox.clientWidth).height(globeBox.clientHeight);
    });
} else {
    globeBox.querySelector(".globe-msg").textContent = "The globe didn't load, check your internet. You can still click the places in the list.";
}

document.getElementById("zoom-out").addEventListener("click", function () {
    if (globe) globe.pointOfView(space, 3000);
});

document.getElementById("zoom-in").addEventListener("click", function () {
    if (globe) globe.pointOfView(capeTown, 3000);
});


// ---------- the fullscreen page for one place ----------

let view = document.getElementById("place-view");
let current = -1;

function openPlace(id) {
    // i put the place in the address so the back button closes it
    location.hash = "place/" + id;
}

function closePlace() {
    location.hash = "places";
}

function showPlace(i) {
    let place = places[i];
    current = i;

    document.getElementById("pv-name").textContent = place.name;
    document.getElementById("pv-type").textContent = types[place.type].label;
    document.getElementById("pv-count").textContent = (i + 1) + " of " + places.length;
    document.getElementById("pv-note").textContent = place.note;
    document.getElementById("pv-tip").textContent = place.tip;
    document.getElementById("pv-wiki").href = "https://en.wikipedia.org/wiki/" + encodeURIComponent(place.wiki);

    let about = document.getElementById("pv-about");
    about.innerHTML = "";
    place.about.forEach(function (text) {
        let p = document.createElement("p");
        p.textContent = text;
        about.appendChild(p);
    });

    let info = document.getElementById("pv-info");
    info.innerHTML = "";
    for (let label in place.info) {
        let row = info.insertRow();
        let th = document.createElement("th");
        th.textContent = label;
        row.appendChild(th);
        row.insertCell().textContent = place.info[label];
    }

    // main picture
    let img = document.getElementById("pv-img");
    img.alt = place.name;
    showPhoto(img, null);
    getPhoto(place, 1280)
        .then(function (src) { if (current == i) showPhoto(img, src); })
        .catch(function () {});

    // more pictures
    let gallery = document.getElementById("pv-gallery");
    gallery.innerHTML = '<p class="loading">Loading pictures...</p>';
    getGallery(place).then(function (pics) {
        if (current != i) return; // they already went to a different place
        gallery.innerHTML = "";
        if (pics.length == 0) {
            gallery.innerHTML = '<p class="loading">No more pictures of this one.</p>';
        }
        pics.forEach(function (pic) {
            let btn = document.createElement("button");
            btn.title = pic.caption;
            let small = document.createElement("img");
            small.alt = pic.caption || place.name;
            small.loading = "lazy";
            small.src = pic.small;
            small.onerror = function () { btn.remove(); };
            btn.appendChild(small);
            // click a small picture to make it the big one
            btn.addEventListener("click", function () {
                showPhoto(img, pic.big);
                view.scrollTo({ top: 0, behavior: "smooth" });
            });
            gallery.appendChild(btn);
        });
    }).catch(function () {
        if (current == i) gallery.innerHTML = '<p class="loading">Couldn\'t load the pictures, check your internet.</p>';
    });

    view.hidden = false;
    view.scrollTop = 0;
    document.body.classList.add("no-scroll");
}

function hidePlace() {
    view.hidden = true;
    current = -1;
    document.body.classList.remove("no-scroll");
}

// runs when the # part of the address changes
function checkHash() {
    if (location.hash.startsWith("#place/")) {
        let id = location.hash.slice(7);
        let i = places.findIndex(function (p) { return p.id == id; });
        if (i != -1) {
            showPlace(i);
            return;
        }
    }
    if (current != -1) hidePlace();
}

window.addEventListener("hashchange", checkHash);
checkHash();

document.getElementById("pv-close").addEventListener("click", closePlace);

document.getElementById("pv-next").addEventListener("click", function () {
    openPlace(places[(current + 1) % places.length].id);
});

document.getElementById("pv-prev").addEventListener("click", function () {
    openPlace(places[(current - 1 + places.length) % places.length].id);
});

// fly the globe to this place
document.getElementById("pv-globe").addEventListener("click", function () {
    let place = places[current];
    closePlace();
    if (globe) globe.pointOfView({ lat: place.lat, lng: place.lng, altitude: 0.004 }, 2500);
});

document.addEventListener("keydown", function (e) {
    if (current == -1) return;
    if (e.key == "Escape") closePlace();
    if (e.key == "ArrowRight") document.getElementById("pv-next").click();
    if (e.key == "ArrowLeft") document.getElementById("pv-prev").click();
});


// ---------- fun facts ----------

let facts = [
    "Table Mountain is about 1085 metres high.",
    "The cable car on Table Mountain opened in 1929.",
    "Cape Town is called the Mother City.",
    "At Boulders Beach you can swim in the same water as the penguins.",
    "The strong south-east wind is called the Cape Doctor.",
    "Kirstenbosch garden was started in 1913.",
    "Table Mountain is one of the New 7 Wonders of Nature.",
    "Cape Point is NOT where the two oceans meet, that is Cape Agulhas."
];

document.getElementById("fact-btn").addEventListener("click", function () {
    let i = Math.floor(Math.random() * facts.length);
    document.getElementById("fact").textContent = facts[i];
});


// ---------- back to top button ----------

let topBtn = document.getElementById("top-btn");

window.addEventListener("scroll", function () {
    topBtn.style.display = window.scrollY > 400 ? "block" : "none";
});
