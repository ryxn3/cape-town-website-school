// ---------- pictures from wikipedia ----------
// i load the pictures from the wikipedia page of each place,
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

// gets all the other pictures on the wikipedia page
function getGallery(place) {
    return getWiki("media-list", place.wiki).then(function (data) {
        let pics = [];
        data.items.forEach(function (item) {
            if (item.type != "image" || !item.srcset || !item.showInGallery) return;
            // skip maps, logos, flags and drawings
            if (/\.svg|map|logo|flag|locator|coat_of_arms|icon/i.test(item.title)) return;
            let biggest = item.srcset[item.srcset.length - 1].src;
            pics.push({
                src: "https:" + item.srcset[0].src,
                big: "https:" + biggest,
                caption: item.caption ? item.caption.text : ""
            });
        });
        return pics.slice(0, 9);
    });
}

// put a picture in an <img>, and hide it if it doesn't load
function showPhoto(img, src) {
    img.classList.remove("broken");
    if (!src) {
        img.classList.add("broken");
        img.removeAttribute("src");
        return;
    }
    img.onerror = function () {
        img.classList.add("broken");
    };
    img.src = src;
}


// ---------- the intro photo ----------

getPhoto(places[0], 960)
    .then(function (src) { showPhoto(document.getElementById("intro-photo"), src); })
    .catch(function () { showPhoto(document.getElementById("intro-photo"), null); });


// ---------- the globe ----------

// colours for the globe, just two greys
let seaColour = "#b8b4ac";
let landColour = "#ebe7df";

let capeTown = { lat: -34.08, lng: 18.43, altitude: 0.015 };
let space = { lat: -15, lng: 20, altitude: 2.6 };
let globe = null;

function makePin(place, number) {
    let colour = types[place.type].colour;
    return '<span class="pin" style="background:' + colour + '"><b>' + number + '</b></span>';
}

let list = document.getElementById("place-list");

places.forEach(function (place, i) {
    let li = document.createElement("li");
    li.innerHTML = '<button>' + makePin(place, i + 1) +
        '<span>' + place.name + '<small>' + place.short + '</small></span></button>';
    li.querySelector("button").addEventListener("click", function () {
        openPlace(place.id);
    });
    list.appendChild(li);
});

// makes the pin that goes on the globe: a dot on the place, a line and a photo
function makeGlobePin(place) {
    let i = places.indexOf(place);
    let colour = types[place.type].colour;

    let el = document.createElement("div");
    el.className = "globe-pin";
    el.innerHTML =
        '<span class="stem"></span>' +
        '<span class="dot" style="background:' + colour + '"></span>' +
        '<button class="photo" style="border-color:' + colour + '">' +
            '<img alt="">' +
            '<b style="background:' + colour + '">' + (i + 1) + '</b>' +
            '<span class="name">' + place.name + '</span>' +
        '</button>';

    let img = el.querySelector("img");
    img.alt = place.name;
    getPhoto(place, 120)
        .then(function (src) { showPhoto(img, src); })
        .catch(function () { showPhoto(img, null); });

    el.querySelector(".photo").addEventListener("click", function () { openPlace(place.id); });
    place.pinEl = el;
    return el;
}

// moves the photos around so they don't sit on top of each other.
// each photo gets a line back to its dot on the place
let photoSize = 46;
let spots = [];
[55, 105, 155].forEach(function (far) {
    // straight up and down first, then sideways
    [-90, 90, -135, -45, 135, 45, 180, 0].forEach(function (angle) {
        let a = angle * Math.PI / 180;
        spots.push({ x: Math.round(Math.cos(a) * far), y: Math.round(Math.sin(a) * far), angle: angle, far: far });
    });
});

function hits(a, b) {
    return Math.abs(a.x - b.x) < (a.size + b.size) / 2 + 4 && Math.abs(a.y - b.y) < (a.size + b.size) / 2 + 4;
}

function spreadPins() {
    let zoomedOut = globe.pointOfView().altitude > 0.4;
    let shown = places.filter(function (place) {
        return place.pinEl && place.pinEl.style.display != "none";
    });

    // the dots are taken too so a photo doesn't cover another place
    let taken = shown.map(function (place) {
        place.screen = globe.getScreenCoords(place.lat, place.lng, 0.0001);
        return { x: place.screen.x, y: place.screen.y, size: 12 };
    });

    shown.forEach(function (place) {
        let el = place.pinEl;
        el.classList.toggle("small", zoomedOut);
        if (zoomedOut) return;

        let pick = spots[0];
        for (let s = 0; s < spots.length; s++) {
            let box = { x: place.screen.x + spots[s].x, y: place.screen.y + spots[s].y, size: photoSize };
            if (!taken.some(function (t) { return hits(t, box); })) {
                pick = spots[s];
                taken.push(box);
                break;
            }
        }

        if (el.pick !== pick) {
            el.pick = pick;
            el.querySelector(".photo").style.transform = "translate(-50%, -50%) translate(" + pick.x + "px, " + pick.y + "px)";
            let stem = el.querySelector(".stem");
            stem.style.width = pick.far + "px";
            stem.style.transform = "rotate(" + pick.angle + "deg)";
        }
    });

    requestAnimationFrame(spreadPins);
}

let globeBox = document.getElementById("globe");

// if globe.gl didn't load (no internet) the list still works
if (window.Globe) {
    // the land shapes are in land.js. cape town is detailed and the rest is simple
    let land = capeLand.concat(worldLand).map(function (rings) {
        return { geometry: { type: "Polygon", coordinates: rings } };
    });

    // globe.gl empties the box it draws in, so it gets its own one
    globe = new Globe(document.getElementById("globe-3d"))
        .width(globeBox.clientWidth)
        .height(globeBox.clientHeight)
        .backgroundColor("#efe9dc")
        .showAtmosphere(false)
        .polygonsData(land)
        .polygonStrokeColor(function () { return false; })
        .polygonAltitude(0.0001)
        .polygonsTransitionDuration(0)
        .htmlElementsData(places)
        .htmlAltitude(0.0001)
        .htmlElement(makeGlobePin)
        // hide the pins when they go round the back of the globe
        .htmlElementVisibilityModifier(function (el, visible) {
            el.style.display = visible ? "" : "none";
        });

    // the lights on the globe make the colours too bright, so the colours
    // "glow" instead (emissive) and then they look exactly like i picked
    function flatColour(colour) {
        let m = globe.globeMaterial().clone();
        m.color.set("#000000");
        m.specular.set("#000000");
        m.emissive.set(colour);
        m.side = 2; // both sides
        return m;
    }
    let landMat = flatColour(landColour);
    let sideMat = flatColour("#9a958c");
    globe.polygonCapMaterial(function () { return landMat; })
        .polygonSideMaterial(function () { return sideMat; });

    let sea = globe.globeMaterial();
    sea.color.set("#000000");
    sea.specular.set("#000000");
    sea.emissive.set(seaColour);
    // pushes the sea a tiny bit back so the land is always drawn on top (no flickering)
    sea.polygonOffset = true;
    sea.polygonOffsetFactor = 4;
    sea.polygonOffsetUnits = 4;

    // start in space and then fly down to cape town
    globe.pointOfView(space);
    setTimeout(function () { globe.pointOfView(capeTown, 4000); }, 800);
    requestAnimationFrame(spreadPins);

    window.addEventListener("resize", function () {
        globe.width(globeBox.clientWidth).height(globeBox.clientHeight);
    });
} else {
    globeBox.querySelector(".globe-msg").textContent = "the globe didn't load, check your internet. you can still click the places in the list!";
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
    // i put the place in the address bar so the back button closes it
    location.hash = "place/" + id;
}

function closePlace() {
    location.hash = "globe-section";
}

function showPlace(i) {
    let place = places[i];
    current = i;

    document.getElementById("pv-name").textContent = place.name;
    document.getElementById("pv-type").textContent = types[place.type].label;
    document.getElementById("pv-type").style.color = types[place.type].colour;
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
        let dt = document.createElement("dt");
        let dd = document.createElement("dd");
        dt.textContent = label;
        dd.textContent = place.info[label];
        info.appendChild(dt);
        info.appendChild(dd);
    }

    // main photo
    let img = document.getElementById("pv-img");
    img.alt = place.name;
    img.removeAttribute("src");
    getPhoto(place, 1280)
        .then(function (src) { if (current == i) showPhoto(img, src); })
        .catch(function () { if (current == i) showPhoto(img, null); });

    // more pictures
    let gallery = document.getElementById("pv-gallery");
    gallery.innerHTML = '<p class="loading">loading pictures...</p>';
    getGallery(place).then(function (pics) {
        if (current != i) return; // they already clicked on a different place
        gallery.innerHTML = "";
        if (pics.length == 0) {
            gallery.innerHTML = '<p class="loading">no more pictures of this one sorry</p>';
        }
        pics.forEach(function (pic) {
            let btn = document.createElement("button");
            btn.title = pic.caption;
            let small = document.createElement("img");
            small.alt = pic.caption || place.name;
            small.loading = "lazy";
            showPhoto(small, pic.src);
            small.addEventListener("error", function () { btn.remove(); });
            btn.appendChild(small);
            // click a small picture to make it the big one
            btn.addEventListener("click", function () {
                showPhoto(img, pic.big);
                view.scrollTo({ top: 0, behavior: "smooth" });
            });
            gallery.appendChild(btn);
        });
    }).catch(function () {
        if (current == i) gallery.innerHTML = '<p class="loading">couldn\'t load the pictures, check your internet</p>';
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

// this runs when the # part of the address changes
function checkHash() {
    let hash = location.hash;
    if (hash.startsWith("#place/")) {
        let id = hash.slice(7);
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

// close the page and fly the globe down to this place
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
    "African penguins live at Boulders Beach and you can swim with them.",
    "The strong south-east wind is called the Cape Doctor.",
    "Kirstenbosch garden was started in 1913.",
    "Table Mountain is one of the New 7 Wonders of Nature.",
    "Cape Point is NOT where the two oceans meet, that is Cape Agulhas."
];

let factText = document.getElementById("fact");

document.getElementById("fact-btn").addEventListener("click", function () {
    let i = Math.floor(Math.random() * facts.length);
    factText.textContent = facts[i];
});


// ---------- back to top button ----------

let topBtn = document.getElementById("top-btn");

window.addEventListener("scroll", function () {
    topBtn.style.display = window.scrollY > 400 ? "block" : "none";
});
