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


// ---------- the big map ----------

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

// if leaflet didn't load (no internet) the list still works
let bigMap = null;
let tiles = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
let credits = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

if (window.L) {
    bigMap = L.map("map", { scrollWheelZoom: false });
    L.tileLayer(tiles, { attribution: credits, maxZoom: 18 }).addTo(bigMap);

    let corners = [];
    places.forEach(function (place, i) {
        let icon = L.divIcon({
            html: makePin(place, i + 1),
            className: "",
            iconSize: [28, 28],
            iconAnchor: [14, 32]
        });
        L.marker([place.lat, place.lng], { icon: icon })
            .addTo(bigMap)
            .bindTooltip(place.name, { direction: "top", offset: [0, -30] })
            .on("click", function () { openPlace(place.id); });
        corners.push([place.lat, place.lng]);
    });
    bigMap.fitBounds(corners, { padding: [30, 30] });
}


// ---------- the fullscreen page for one place ----------

let view = document.getElementById("place-view");
let current = -1;
let smallMap = null;
let smallMarker = null;

function openPlace(id) {
    // i put the place in the address bar so the back button closes it
    location.hash = "place/" + id;
}

function closePlace() {
    location.hash = "map-section";
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

    // little map on the side
    if (window.L) {
        if (!smallMap) {
            smallMap = L.map("pv-map", { scrollWheelZoom: false });
            L.tileLayer(tiles, { attribution: credits, maxZoom: 18 }).addTo(smallMap);
            smallMarker = L.marker([place.lat, place.lng]).addTo(smallMap);
        }
        smallMap.invalidateSize();
        smallMap.setView([place.lat, place.lng], 13);
        smallMarker.setLatLng([place.lat, place.lng]);
        smallMarker.setIcon(L.divIcon({
            html: makePin(place, i + 1),
            className: "",
            iconSize: [28, 28],
            iconAnchor: [14, 32]
        }));
    }
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
