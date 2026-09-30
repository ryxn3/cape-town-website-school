// all the places on the globe
// wiki = the name of the wikipedia page, the pictures come from there
// lat / lng = where it is on the globe (i got these from google maps)

let places = [
    {
        id: "table-mountain",
        name: "Table Mountain",
        wiki: "Table_Mountain",
        type: "nature",
        lat: -33.9575, lng: 18.4030,
        short: "The flat mountain you see from everywhere in the city.",
        note: "We hiked up Platteklip Gorge and my legs were dead for 2 days. Worth it tho.",
        about: [
            "Table Mountain is the big flat topped mountain right behind the city. It is about 1085 metres high and it is one of the New 7 Wonders of Nature.",
            "You can get to the top two ways. The cable car takes about 5 minutes and the floor spins around so everyone gets a view. Or you can hike, the most popular path is Platteklip Gorge and it takes around 2 to 3 hours going up.",
            "Sometimes a white cloud sits on top of the mountain and pours down the sides. People call it the tablecloth."
        ],
        info: {
            "Getting there": "Drive or Uber to the lower cable station on Tafelberg Road",
            "Time needed": "Half a day",
            "Best time": "Early morning on a day with no wind",
            "Cost": "Paying for the cable car, hiking is free"
        },
        tip: "Check if the cable car is open before you go, it closes when it is too windy."
    },
    {
        id: "lions-head",
        name: "Lion's Head",
        wiki: "Lion's_Head_(Cape_Town)",
        type: "nature",
        lat: -33.9353, lng: 18.3890,
        short: "Pointy mountain next to Table Mountain, the best hike for sunset.",
        note: "There are chains you have to climb near the top!! a bit scary but so fun",
        about: [
            "Lion's Head is the pointy peak between Table Mountain and Signal Hill. It is 669 metres high.",
            "The hike goes round and round the mountain so you see the whole city, Camps Bay and the ocean on the way up. It takes about 1 to 1.5 hours to the top.",
            "Near the top there are chains and ladders on the rocks. There is also an easier way round if you don't want to do them."
        ],
        info: {
            "Getting there": "Parking on Signal Hill Road",
            "Time needed": "2 to 3 hours",
            "Best time": "Sunrise or sunset (bring a torch)",
            "Cost": "Free"
        },
        tip: "On full moon lots of people hike up at night. Go with a group."
    },
    {
        id: "bo-kaap",
        name: "Bo-Kaap",
        wiki: "Bo-Kaap",
        type: "culture",
        lat: -33.9205, lng: 18.4150,
        short: "Super colourful houses and cobbled streets.",
        note: "Everyone takes photos in front of the pink house lol. we did too",
        about: [
            "The Bo-Kaap is an old neighbourhood on the side of Signal Hill, right next to the city centre. It is famous for the brightly painted houses.",
            "It is the home of the Cape Malay community. A lot of them are descendants of people who were brought here as slaves from places like Indonesia and Malaysia in the 1600s and 1700s.",
            "The Auwal Mosque here was built in 1794 and is the oldest mosque in South Africa. There is also the Bo-Kaap Museum on Wale Street."
        ],
        info: {
            "Getting there": "Walk up Wale Street from the city centre",
            "Time needed": "1 to 2 hours",
            "Best time": "Morning, the light is nice for photos",
            "Cost": "Free to walk around"
        },
        tip: "Do a Cape Malay cooking class, you make samoosas and curry and then eat it all."
    },
    {
        id: "waterfront",
        name: "V&A Waterfront",
        wiki: "Victoria_&_Alfred_Waterfront",
        type: "city",
        lat: -33.9036, lng: 18.4207,
        short: "The harbour with shops, food, music and the aquarium.",
        note: "We saw seals sleeping on a platform right next to the walkway",
        about: [
            "The Waterfront is in the old harbour. It is named after Queen Victoria and her son Prince Alfred.",
            "There are lots of shops and restaurants, and street musicians play by the water. The Two Oceans Aquarium is here and you can see sharks and a massive kelp forest.",
            "Zeitz MOCAA is an art museum built inside an old grain silo. There is also Nobel Square with statues of South Africa's four Nobel Peace Prize winners."
        ],
        info: {
            "Getting there": "MyCiTi bus from the city or Uber",
            "Time needed": "As long as you want",
            "Best time": "Sunset",
            "Cost": "Free to walk around"
        },
        tip: "The ferry to Robben Island leaves from here."
    },
    {
        id: "robben-island",
        name: "Robben Island",
        wiki: "Robben_Island",
        type: "history",
        lat: -33.8067, lng: 18.3662,
        short: "The island where Nelson Mandela was in prison for 18 years.",
        note: "Our guide was actually a prisoner there. that was really intense",
        about: [
            "Robben Island is about 7 km out in Table Bay. It was used as a prison for hundreds of years, but it is most famous for the political prisoners who were kept there during apartheid.",
            "Nelson Mandela spent 18 of his 27 years in prison here. On the tour you can see his tiny cell and the lime quarry where the prisoners had to work.",
            "It became a UNESCO World Heritage Site in 1999. A lot of the tour guides were prisoners on the island themselves."
        ],
        info: {
            "Getting there": "Ferry from the Nelson Mandela Gateway at the Waterfront",
            "Time needed": "About 4 hours with the boat",
            "Best time": "Morning, the sea is calmer",
            "Cost": "Paying, ticket includes the ferry"
        },
        tip: "Book online a few days before. The ferry gets cancelled if the sea is too rough."
    },
    {
        id: "kirstenbosch",
        name: "Kirstenbosch",
        wiki: "Kirstenbosch_National_Botanical_Garden",
        type: "nature",
        lat: -33.9875, lng: 18.4327,
        short: "A massive garden on the back of Table Mountain.",
        note: "From the Boomslang you can see the back of Table Mountain, so green",
        about: [
            "Kirstenbosch is a botanical garden on the eastern side of Table Mountain. It was started in 1913 and it only grows plants from South Africa.",
            "The Tree Canopy Walkway, called the Boomslang (that means tree snake), is a curvy bridge that goes through the tops of the trees.",
            "In summer there are concerts on the lawn on Sunday evenings. People bring picnics and sit on the grass."
        ],
        info: {
            "Getting there": "Drive or Uber, about 20 minutes from the city",
            "Time needed": "2 to 4 hours",
            "Best time": "Spring (September) when the flowers are out",
            "Cost": "Paying"
        },
        tip: "Look out for proteas, the national flower. They look like something from another planet."
    },
    {
        id: "camps-bay",
        name: "Camps Bay",
        wiki: "Camps_Bay",
        type: "beach",
        lat: -33.9510, lng: 18.3776,
        short: "White sand, palm trees and mountains behind.",
        note: "The water was SO cold I lasted like 30 seconds",
        about: [
            "Camps Bay is a beach on the Atlantic side with white sand and palm trees. The Twelve Apostles mountains are right behind it.",
            "The road along the beach is full of restaurants and cafés.",
            "The Atlantic water here is really cold, usually around 12 to 15 degrees, even in summer."
        ],
        info: {
            "Getting there": "MyCiTi bus from the city or Uber",
            "Time needed": "An afternoon",
            "Best time": "Summer afternoon when the wind is not blowing",
            "Cost": "Free"
        },
        tip: "Parking is hard to find on weekends, take the bus."
    },
    {
        id: "muizenberg",
        name: "Muizenberg",
        wiki: "Muizenberg",
        type: "beach",
        lat: -34.1075, lng: 18.4700,
        short: "Colourful beach huts and the best place to learn to surf.",
        note: "I stood up on the board 2 times!! (fell off like 40 times)",
        about: [
            "Muizenberg is on the False Bay side. The water here is warmer than on the Atlantic side.",
            "It is known for its row of brightly coloured beach huts. The waves are small and gentle so it is a good place for beginners to learn to surf, and there are lots of surf schools.",
            "The Shark Spotters program started here. People sit on the mountain and look out for sharks and put up a flag to warn the surfers."
        ],
        info: {
            "Getting there": "Drive or Uber, about 30 minutes from the city",
            "Time needed": "Half a day",
            "Best time": "Summer mornings",
            "Cost": "Free (surf lessons are paying)"
        },
        tip: "Stop at Kalk Bay on the way for fish and chips."
    },
    {
        id: "boulders",
        name: "Boulders Beach",
        wiki: "Boulders_Beach",
        type: "animals",
        lat: -34.1970, lng: 18.4515,
        short: "A beach full of African penguins!",
        note: "My favourite place!!! one penguin walked right past my foot",
        about: [
            "Boulders Beach is in Simon's Town. It is a small beach between big granite boulders, and it is home to a colony of African penguins.",
            "The colony started in 1982 with just two pairs of penguins. Now there are a couple of thousand, but African penguins are endangered so their numbers are going down.",
            "There are wooden boardwalks so you can see them really close without bothering them. At Boulders you can even swim in the same water as the penguins."
        ],
        info: {
            "Getting there": "Drive or Uber, about 45 minutes from the city",
            "Time needed": "1 to 2 hours",
            "Best time": "Early morning before the tour buses come",
            "Cost": "Paying (it is part of the national park)"
        },
        tip: "Don't touch the penguins, they bite! Their beaks are really sharp."
    },
    {
        id: "cape-point",
        name: "Cape Point",
        wiki: "Cape_Point",
        type: "nature",
        lat: -34.3534, lng: 18.4969,
        short: "Cliffs, an old lighthouse and baboons at the tip of the peninsula.",
        note: "A baboon stole a packet of chips from the car next to us",
        about: [
            "Cape Point is right at the end of the Cape Peninsula, inside Table Mountain National Park. There are huge cliffs going straight down into the ocean.",
            "You can walk up or take the Flying Dutchman funicular to the old lighthouse. The old lighthouse was built in 1860 but it was too high up and often hidden in the clouds, so they built a new one lower down.",
            "A lot of people think this is where the Atlantic and Indian oceans meet but actually that is at Cape Agulhas, which is further east."
        ],
        info: {
            "Getting there": "Drive, about 1 hour. Go on Chapman's Peak Drive for the views",
            "Time needed": "A whole day",
            "Best time": "A clear day, go early",
            "Cost": "Paying (national park)"
        },
        tip: "Keep your car windows closed and don't carry food, the baboons know how to open doors."
    }
];

// the colour for each type of place
let types = {
    nature:  { label: "Nature",  colour: "#3f7d4e" },
    beach:   { label: "Beach",   colour: "#2a7fa8" },
    animals: { label: "Animals", colour: "#e07a2e" },
    culture: { label: "Culture", colour: "#c94f7c" },
    history: { label: "History", colour: "#6b5b95" },
    city:    { label: "City",    colour: "#b08a1e" }
};
