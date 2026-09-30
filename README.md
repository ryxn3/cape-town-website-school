# Cape Town Guide

My school project, a simple website about Cape Town.

I saved my work in steps so you can see how it was made:

- [**step-1-start**](step-1-start/) - just the basic html, a title and a list
- [**step-2-content**](step-2-content/) - added all the text, pictures and the menu (no css yet)
- [**step-3-colours**](step-3-colours/) - added a css file with colours, a font and the big picture at the top
- [**step-4-layout**](step-4-layout/) - places are now cards in a grid, more places, food and tips boxes
- [**step-5-final**](step-5-final/) - hover effects, fun fact button, back to top button and it works on phones
- [**step-6-globe**](step-6-globe/) - the newest one: a simple grey 3D globe that zooms in on Cape Town with a photo pin for every place, click a place to open a full page about it with more info and pictures

To open it just double click `index.html` in any of the folders.

Or run it on localhost with python:

```
python serve.py
```

That opens the newest version at http://localhost:8000/step-6-globe/. To see a different step put the folder name after it, like `python serve.py step-3-colours`. Press Ctrl+C to stop.

Pictures are from Wikimedia Commons. In step 6 they load straight from the Wikipedia page of each place, so you need internet for those. The land on the globe is drawn from coastline data saved in `land.js` (from OpenStreetMap and Natural Earth), so it needs no map service or API key.
